/* eslint-disable @typescript-eslint/no-unused-expressions */

import React, { useEffect, useRef, useState } from 'react';
import { toISODateTime } from 'src/lib/date/ISODateTime';
import { UserRecord, IceServerRecord } from 'dstnd-io';
import { SocketClient } from 'src/services/socket/SocketClient';
import { useSelector, useDispatch } from 'react-redux';
import { SocketConsumer } from '../SocketProvider';
import {
  createRoomAction,
  addMyStream,
  addPeerStream,
  updateRoomAction,
  remmoveMyStream,
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

export type PeerProviderProps = {
  user: UserRecord;
  iceServers: IceServerRecord[];
};

export const PeerProvider: React.FC<PeerProviderProps> = ({
  user,
  iceServers,
  ...props
}) => {
  const proxy = useRef(new Proxy()).current;
  const peerConnections = useRef<PeerConnections>();
  const [contextState, setContextState] = useState<PeerContextProps>({ state: 'init' });
  const [socket, setSocket] = useState<SocketClient | undefined>();

  const state = useSelector(selectPeerProviderState);
  const dispatch = useDispatch();

  // PeerConnections Setup
  useEffect(() => {
    const peerConnectionsInstance = new PeerConnections({
      user,
      iceServers,
    });

    const unsubscribeFromOnPeerStream = peerConnectionsInstance.onPeerStream(({ peerId, stream }) => {
      dispatch(addPeerStream({ peerId, stream }));
    });

    peerConnections.current = peerConnectionsInstance;

    return () => {
      unsubscribeFromOnPeerStream();
      peerConnectionsInstance.destroy();
    }
  }, []);

  // Clean up the peerConnections if there is no more room
  useEffect(() => {
    if (!state.room && peerConnections.current) {
      peerConnections.current.disconnect();
    }
  }, [state.room, peerConnections.current]);

  useEffect(() => {
    console.group('state room changed to', state.room);
    console.log('peerConnections', peerConnections.current);
    console.groupEnd();
  }, [state.room, peerConnections.current]);

  // Context State Management
  useEffect(() => {
    setContextState(() => {
      if (!(state.me && socket)) {
        return {
          state: 'init',
        }
      }

      if (!state.room) {
        return {
          state: 'notJoined',
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

        // this is needed here as otherwise the old state is used
        broadcastMessage: (message) => {
          const payload: PeerMessageEnvelope = {
            message,
            timestamp: toISODateTime(new Date()),
          };

          Object
            .values(peerConnections.current?.connections ?? {})
            .forEach((apc) => {
              apc.sendMessage(payload);
            });

          proxy.publishOnPeerMessageSent(payload);
        },

        request: (payload) => socket?.send(payload),

        startLocalStream: () => {
          if (!state.room?.me.connection.channels.streaming.on) {
            navigator.mediaDevices
              .getUserMedia({ video: true, audio: true })
              .then((stream) => {
                dispatch(addMyStream({ stream }));
              });
          }
        },
        stopLocalStream: () => {
          if (!state.room?.me.connection.channels.streaming.on) {
            return;
          }

          state.room?.me.connection.channels.streaming.stream
            .getTracks()
            .forEach((track) => {
              if (state.room?.me.connection.channels.streaming.on) {
                state.room?.me.connection.channels.streaming.stream.removeTrack(
                  track
                );
              }
            });

          remmoveMyStream();
        },
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
          dispatch(createMeAction(msg.content));
        } else {
          dispatch(updateMeAction(msg.content));
        }
      }

      else if (msg.kind === 'joinedRoomUpdated') {
        dispatch(updateRoomAction({ room: msg.content }));

        return;
      }

      else if (msg.kind === 'joinRoomSuccess') {
        dispatch(
          createRoomAction({
            room: msg.content.room,
            me: msg.content.me,
          }),
        );

        // This should probably be in an effect but keeping it in sync it's too tedious that way
        peerConnections.current?.connect(msg.content.room.peers);
      }
    });

    return () => {
      onMessageUnsubscriber();
    }
  }, [socket, state]);


  if (!iceServers) {
    return null;
  }

  return (
    <SocketConsumer
      onReady={(socketClient) => {
        setSocket(socketClient);

        socketClient.send({
          kind: 'userIdentification',
          content: { userId: user.id },
        });
      }}
      onClose={() => {
        // TODO: This could be changed at some point - when I'm redoing
        //  the strategy for Peer Removal.
        dispatch(removeMeAction());

        // Once the socket fails destroy the PeerConnection as well
        peerConnections.current?.destroy();
      }}
      render={() => (
        <PeerContext.Provider value={contextState}>
          {props.children}
        </PeerContext.Provider>
      )}
    />
  );
};
