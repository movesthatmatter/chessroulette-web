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
  closePeerChannelsAction,
} from './actions';
import { RoomCredentials } from './util';
import { PeerMessageEnvelope } from './records';
import { Proxy } from './Proxy';
import { PeerContextProps, PeerContext } from './PeerContext';
import { selectPeerProviderState } from './selectors';
import { resources } from 'src/resources';
import { selectAuthentication } from 'src/services/Authentication';
import { usePeerConnections } from './usePeerConnections';
import useInstance from '@use-it/instance';

export type PeerProviderProps = {};

export const PeerProvider: React.FC<PeerProviderProps> = (props) => {
  const proxy = useInstance<Proxy>(() => new Proxy());
  const [contextState, setContextState] = useState<PeerContextProps>({ state: 'init' });
  const [socket, setSocket] = useState<SocketClient | undefined>();
  const [iceServers, setIceServers] = useState<IceServerRecord[]>();
  const auth = useSelector(selectAuthentication);
  const state = useSelector(selectPeerProviderState);
  const dispatch = useDispatch();

  // Get ICE Urls onmount
  useEffect(() => {
    (async () => {
      (await resources.getIceURLS()).map(setIceServers);
    })();
  }, []);

  const pcState = usePeerConnections(
    iceServers,
    auth.authenticationType === 'none' ? undefined : auth.user,
    {
      onOpen: () => {},
      // onPeerConnected: (p) => {},
      onPeerDisconnected: (peerId) => {
        dispatch(closePeerChannelsAction({ peerId }));
      },
      onPeerStream: (p) => {
        dispatch(addPeerStream(p));
      },
    }
  );

  useEffect(() => {
    if (!(state.room && pcState.status === 'open')) {
      return;
    }

    // Reconcile the Room Peers with the PeerConnections
    //  i.e. Remove any peer connections that aren't part of the room anymore!
    Object.keys(pcState.client.connections).forEach((peerId) => {
      if (!state.room) {
        return;
      }

      if (!state.room.peers[peerId]) {
        pcState.client.removePeerConnection(peerId);
      }
    });
  }, [state.room, pcState]);

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
        connected: pcState.status === 'open' && pcState.connected,

        // This is the action that starts the P2P connection
        //  and it needs to be on demand so the user is in control
        //  of it!
        connectToRoom: () => {
          if (pcState.status === 'open' && state.room?.peers) {
            pcState.connect(state.room.peers);
          }
        },

        disconnectFromRoom: () => {
          if (pcState.status === 'open') {
            pcState.disconnect();
          }
        },

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

          if (pcState.status === 'open') {
            Object.values(pcState.client.connections).forEach((apc) => {
              apc.sendMessage(payload);
            });
          }

          proxy.publishOnPeerMessageSent(payload);
        },

        request: (payload) => socket?.send(payload),
      };
    });
  }, [state.room, state.me, socket, pcState]);

  // Socket Message Handler
  useEffect(() => {
    if (!socket) {
      return;
    }

    const onMessageUnsubscriber = socket.onMessage((msg) => {
      if (msg.kind === 'iam') {
        if (!state.me) {
          dispatch(
            createMeAction({
              me: msg.content.peer,
              joinedRoom: msg.content.hasJoinedRoom ? msg.content.room : undefined,
            })
          );
        } else {
          dispatch(
            updateMeAction({
              me: msg.content.peer,
              joinedRoom: msg.content.hasJoinedRoom ? msg.content.room : undefined,
            })
          );
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
            pcState.destroy();
          }}
          render={() => null}
        />
      )}
      <PeerContext.Provider value={contextState}>{props.children}</PeerContext.Provider>
    </>
  );
};
