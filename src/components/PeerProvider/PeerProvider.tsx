/* eslint-disable @typescript-eslint/no-unused-expressions */

import React, { useEffect, useRef, useState } from 'react';
import { toISODateTime } from 'src/lib/date/ISODateTime';
import { IceServerRecord } from 'dstnd-io';
import { SocketClient } from 'src/services/socket/SocketClient';
import { useSelector, useDispatch } from 'react-redux';
import { SocketConsumer } from '../SocketProvider';
import {
  createRoomAction,
  addPeerStream,
  updateRoomAction,
  createMeAction,
  updateMeAction,
  removeMeAction,
} from './actions';
import { RoomCredentials } from './util';
import { PeerMessageEnvelope } from './records';
import { Proxy } from './Proxy';
import { PeerContextProps, PeerContext } from './PeerContext';
import { selectPeerProviderState } from './selectors';
import { PeerConnections } from './PeerConnections';
import { logsy } from 'src/lib/logsy';
import { resources } from 'src/resources';
import { selectAuthentication } from 'src/services/Authentication';

export type PeerProviderProps = {};

export const PeerProvider: React.FC<PeerProviderProps> = (props) => {
  const proxy = useRef(new Proxy()).current;
  const peerConnections = useRef<PeerConnections>();
  const [contextState, setContextState] = useState<PeerContextProps>({ state: 'init' });
  const [socket, setSocket] = useState<SocketClient | undefined>();
  const [iceServers, setIceServers] = useState<IceServerRecord[]>();
  const auth = useSelector(selectAuthentication);
  const state = useSelector(selectPeerProviderState);
  const [initialRoomPeers, setInitialRoomPeers] = useState(state.room?.peers);
  const dispatch = useDispatch();

  // Get ICE Urls onmount
  useEffect(() => {
    (async () => {
      (await resources.getIceURLS()).map(setIceServers);
    })();
  }, []);

  useEffect(() => {
    // If there is no room there's nothing to updat
    if (!state.room) {
      // If there is no room but there are previousy set initialRoomPeers
      //  then reset those
      if (initialRoomPeers) {
        setInitialRoomPeers(undefined);
      }

      return;
    }

    setInitialRoomPeers(state.room.peers);
  }, [state.room, initialRoomPeers]);

  // PeerConnections Setup
  // Note: This only gets setup when there is a Room and an Authenticated User!
  useEffect(() => {
    if (!(iceServers && auth.authenticationType !== 'none' && state.room && !peerConnections.current)) {
      return;
    }

    peerConnections.current = new PeerConnections({
      user: auth.user,
      iceServers,
    });
  }, [iceServers, state.room, peerConnections.current, auth]);


  // PeerConnection Event Subscribers
  useEffect(() => {
    if (!(peerConnections.current && initialRoomPeers)) {
      return;
    }

    const unsubscribeFromOnOpen = peerConnections.current.onOpen(() => {
      if (peerConnections.current && initialRoomPeers) {
        peerConnections.current?.connect(initialRoomPeers);
      }
    });
    const unsubscribeFromOnPeerStream = peerConnections.current.onPeerStream(
      ({ peerId, stream }) => {
        dispatch(addPeerStream({ peerId, stream }));
      }
    );

    const unsubscribeFromOnError = peerConnections.current.onError((error) => {
      logsy.error('[PeerProvider]', error);
      if (error === 'PEER_ID_TAKEN') {
        // TODO This should probably do some fault tolerance
        setContextState({
          state: 'error',
          error,
        });
      }

      // TODO: In case of other errors don't do anything yet!
    });

    return () => {
      unsubscribeFromOnOpen();
      unsubscribeFromOnPeerStream();
      unsubscribeFromOnError();
    }
  }, [peerConnections.current, initialRoomPeers]);

  // PeerConnections Cleanup if there is no more room
  useEffect(() => {
    if (!state.room && peerConnections.current) {
      peerConnections.current.destroy();
      peerConnections.current = undefined;
    }
  }, [state.room, peerConnections.current]);

  // PeerConnections & Room reconciler
  //  Remove any PeerConnections that aren't in the room anymore!
  useEffect(() => {
    if (!state.room) {
      return;
    }

    // Reconcile the Room Peers with the PeerConnections
    //  i.e. Remove any peer connectoins that aren't part of the room anymore!
    Object.keys(peerConnections.current?.connections ?? []).forEach((peerId) => {
      if (!state.room) {
        return;
      }

      if (!state.room.peers[peerId]) {
        console.log('[PeerProvider] Reconciler remove APC', peerId);
        peerConnections.current?.removePeerConnection(peerId);
      }
    });

  }, [state.room]);

  // Context State Management
  useEffect(() => {
    setContextState(() => {
      if (!(state.me && socket)) {
        return {
          state: 'init',
        };
      }

      if (!state.room) {
        return {
          state: 'notJoined',
          proxy,
          me: state.me,
          joinRoom: (credentials: RoomCredentials) => {
            socket.send({
              kind: 'joinRoomRequest',
              content: {
                roomId: credentials.id,
                code: credentials.code,
              },
            });
          },
          request: (payload) => socket?.send(payload),
        };
      }

      return {
        state: 'joined',
        proxy,
        me: state.me,
        room: state.room,
        leaveRoom: () => {
          socket.send({
            kind: 'leaveRoomRequest',
            content: undefined,
          });
        },

        // this is needed here as otherwise the old state is used
        broadcastMessage: (message) => {
          const payload: PeerMessageEnvelope = {
            message,
            timestamp: toISODateTime(new Date()),
          };

          Object.values(peerConnections.current?.connections ?? {}).forEach((apc) => {
            apc.sendMessage(payload);
          });

          proxy.publishOnPeerMessageSent(payload);
        },

        request: (payload) => socket?.send(payload),
      };
    });
  }, [state.room, state.me, socket]);

  // Socket Message Handler
  useEffect(() => {
    if (!socket) {
      return;
    }

    const onMessageUnsubscriber = socket.onMessage((msg) => {
      if (msg.kind === 'iam') {
        if (!state.me) {
          dispatch(createMeAction({
            me: msg.content.peer,
            joinedRoom: msg.content.hasJoinedRoom ? msg.content.room : undefined,
          }));
        } else {
          dispatch(updateMeAction({
            me: msg.content.peer,
            joinedRoom: msg.content.hasJoinedRoom ? msg.content.room : undefined,
          }));
        }
      } else if (msg.kind === 'joinedRoomUpdated') {
        dispatch(updateRoomAction({ room: msg.content }));

        return;
      } else if (msg.kind === 'joinRoomSuccess') {
        dispatch(
          createRoomAction({
            room: msg.content.room,
            me: msg.content.me,
          })
        );
      }
    });

    return () => {
      onMessageUnsubscriber();
    };
  }, [socket, state]);

  return (
    <>
    {/* TODO: Make sure this works correctly when the auth user changes */}
      {auth.authenticationType !== 'none' && (
        // TODO: This is rendered here only to be able to react to its events
        // not UI, but ideally it will be a hook!
        <SocketConsumer
          onReady={(socketClient) => {
            setSocket(socketClient);

            socketClient.send({
              kind: 'userIdentification',
              content: { userId: auth.user.id },
            });
          }}
          onClose={() => {
            dispatch(removeMeAction());

            // Once the socket closes destroy the PeerConnection as well
            peerConnections.current?.destroy();
          }}
          render={() => null}
        />
      )}
      <PeerContext.Provider value={contextState}>
        {props.children}
      </PeerContext.Provider>
    </>
  );
};
