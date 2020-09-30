/* eslint-disable @typescript-eslint/no-unused-expressions */

import React, { useEffect, useRef, useState } from 'react';
import PeerSDK from 'peerjs';
import { logsy } from 'src/lib/logsy';
import config from 'src/config';
import { toISODateTime } from 'src/lib/date/ISODateTime';
import { isLeft } from 'fp-ts/lib/Either';
import { eitherToResult } from 'src/lib/ioutil';
import { UserRecord, RoomStatsRecord, RoomRecord } from 'dstnd-io';
import { SocketClient } from 'src/services/socket/SocketClient';
import { useSelector, useDispatch } from 'react-redux';
import { resources } from 'src/resources';
import { SocketConsumer } from '../SocketProvider';
import {
  createRoomAction,
  addPeerAction,
  addMyStream,
  addPeerStream,
  removePeerAction,
  updateRoomAction,
  remmoveMyStream,
  removeRoomAction,
} from './actions';
import { ActivePeerConnections } from './ActivePeerConnections';
import { wNamespace, woNamespace } from './util';
import {
  peerMessageEnvelope,
  PeerMessageEnvelope,
  peerConnectionMetadata,
  PeerConnectionMetadata,
} from './records';
import { Proxy } from './Proxy';
import { PeerContextProps, PeerContext } from './PeerContext';
import { selectJoinedRoom } from './selectors';
import { Room } from '../RoomProvider';

export type PeerProviderProps = {
  roomCredentials: {
    id: string;
    code?: string;
  };
  user: UserRecord;
};

export const PeerProvider: React.FC<PeerProviderProps> = (props) => {
  const peerSDK = useRef<PeerSDK>();
  const activePeerConnections = useRef(new ActivePeerConnections()).current;
  const state = useSelector(selectJoinedRoom);
  const dispatch = useDispatch();

  const [unjoinedRoom, setUnjoinedRoom] = useState<RoomRecord | undefined>();
  const proxy = useRef(new Proxy()).current;
  const [contextState, setContextState] = useState<PeerContextProps>({
    state: 'init',
  });
  const [socket, setSocket] = useState<SocketClient | undefined>();

  useEffect(() => {
    if (unjoinedRoom) {
      return;
    }

    resources
      .getRoom({
        roomId: props.roomCredentials.id,
        code: props.roomCredentials.code,
      })
      .map(setUnjoinedRoom);
  }, [props.roomCredentials]);

  useEffect(() => {
    setContextState(() => {
      if (!(unjoinedRoom && socket)) {
        return {
          state: 'init',
        };
      }

      if (!state.room) {
        return {
          state: 'notJoined',
          room: unjoinedRoom,
          joinRoom: () => {
            socket.send({
              kind: 'joinRoomRequest',
              content: {
                roomId: props.roomCredentials.id,
                code: props.roomCredentials.code,
              },
            });
          },
          request: (payload) => socket?.send(payload),
        };
      }

      return {
        state: 'joined',
        proxy,
        room: state.room,

        // this is needed here as otherwise the old state is used
        broadcastMessage: (message) => {
          const payload: PeerMessageEnvelope = {
            message,
            timestamp: toISODateTime(new Date()),
          };

          Object.keys(state.room?.peers ?? {}).forEach((peerId) => {
            activePeerConnections.get(peerId)?.data?.send(payload);
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
  }, [state.room, unjoinedRoom, socket]);

  useEffect(
    () => () => {
      activePeerConnections.removeAll();

      // Destroy the PeerJS Server connection as well
      peerSDK.current?.destroy();
    },
    [],
  );

  const onDataHandler = (data: unknown) => {
    const result = peerMessageEnvelope.decode(data);

    if (isLeft(result)) {
      logsy.error(
        '[PeerProvider] onMessageHandler(): Message Decoding Error',
        data,
      );

      return;
    }

    proxy.publishOnPeerMessageReceived(result.right);
  };

  return (
    <SocketConsumer
      onMessage={(msg) => {
        if (msg.kind === 'roomStats') {
          dispatch(updateRoomAction({ room: msg.content }));

          return;
        }

        if (msg.kind === 'joinRoomSuccess') {
          dispatch(
            createRoomAction({
              room: msg.content.room,
              me: msg.content.me,
            }),
          );

          // TODO: This should be in its own message handler and inside a UseEffect
          //  since we don't want to initialize it multiple times
          const sdk = new PeerSDK(
            wNamespace(msg.content.me.id),
            config.SIGNALING_SERVER_CONFIG,
          );
          peerSDK.current = sdk;

          sdk.on('error', logsy.error);

          sdk.on('open', () => {
            // Connect to all Peers
            Object.values(msg.content.room.peers)
              .filter(({ id }) => id !== msg.content.me.id)
              .forEach((peer) => {
                const namespacedPeerId = wNamespace(peer.id);

                const metadata: PeerConnectionMetadata = {
                  peer: msg.content.me,
                };

                const pc = sdk.connect(namespacedPeerId, { metadata });

                pc.on('error', logsy.error);

                pc.on('open', () => {
                  activePeerConnections.add(peer.id, { data: pc });

                  dispatch(addPeerAction(msg.content.room.peers[peer.id]));

                  navigator.mediaDevices
                    .getUserMedia({ video: true, audio: true })
                    .then((stream) => {
                      const call = sdk.call(namespacedPeerId, stream);

                      call.on('stream', (remoteStream) => {
                        dispatch(
                          addPeerStream({
                            peerId: peer.id,
                            stream: remoteStream,
                          }),
                        );
                      });

                      activePeerConnections.add(peer.id, {
                        media: {
                          connection: call,
                          localStream: stream,
                        },
                      });
                    });
                });

                pc.on('data', onDataHandler);

                pc.on('close', () => {
                  dispatch(removePeerAction({ peerId: peer.id }));

                  activePeerConnections.remove(peer.id);
                });
              });
          });

          sdk.on('connection', (pc) => {
            const peerId = woNamespace(pc.peer);

            pc.on('error', logsy.error);

            pc.on('data', onDataHandler);

            pc.on('open', () => {
              eitherToResult(peerConnectionMetadata.decode(pc.metadata)).map(
                (metadata) => {
                  activePeerConnections.add(peerId, { data: pc });

                  dispatch(
                    addPeerAction(metadata.peer),
                  );
                },
              );
            });

            pc.on('close', () => {
              activePeerConnections.remove(peerId);

              dispatch(removePeerAction({ peerId }));
            });
          });

          sdk.on('close', () => {
            console.log('SDK on close');
          });

          sdk.on('disconnected', () => {
            console.log('SDK on disconnected');
          });

          sdk.on('call', (call) => {
            const peerId = woNamespace(call.peer);

            navigator.mediaDevices
              .getUserMedia({ video: true, audio: true })
              .then((localStream) => {
                activePeerConnections.add(peerId, {
                  media: {
                    connection: call,
                    localStream,
                  },
                });

                return localStream;
              })
              .then((localStream) => {
                call.answer(localStream);
                call.on('stream', (remoteStream) => {
                  dispatch(
                    addPeerStream({
                      peerId,
                      stream: remoteStream,
                    }),
                  );
                });
              });
          });
        }
      }}
      onReady={(socketClient) => {
        setSocket(socketClient);

        socketClient.send({
          kind: 'userIdentification',
          content: { userId: props.user.id },
        });
      }}
      onClose={() => {
        dispatch(removeRoomAction());
      }}
      render={() => (
        <PeerContext.Provider value={contextState}>
          {props.children}
        </PeerContext.Provider>
      )}
    />
  );
};
