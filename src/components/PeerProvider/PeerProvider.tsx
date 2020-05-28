import React, {
  useEffect, useRef, useReducer, useState,
} from 'react';
import PeerSDK from 'peerjs';
import { logsy } from 'src/lib/logsy';
import config from 'src/config';
import { toISODateTime } from 'src/lib/date/ISODateTime';
import { isLeft } from 'fp-ts/lib/Either';
import { noop } from 'src/lib/util';
import { SocketConsumer } from '../SocketProvider';
import {
  initialState,
  reducer,
  createRoomAction,
  addPeerAction,
  addMyStream,
  addPeerStream,
  removePeerAction,
} from './reducer';
import { ActivePeerConnections } from './ActivePeerConnections';
import { wNamespace, woNamespace } from './util';
import { PeerMessageEnvelope, peerMessageEnvelope } from './records';
import { Proxy } from './Proxy';
import { PeerContextProps, PeerContext } from './PeerContext';

export type PeerProviderProps = {
  roomCredentials: {
    id: string;
    code?: string;
  };
};

export const PeerProvider: React.FC<PeerProviderProps> = (props) => {
  const peerSDK = useRef<PeerSDK>();
  const activePeerConnections = useRef(new ActivePeerConnections()).current;
  const [state, dispatch] = useReducer(reducer, initialState);
  const proxy = useRef(new Proxy()).current;
  const [contextState, setContextState] = useState<PeerContextProps>({ state: 'init' });

  useEffect(() => {
    setContextState((prev) => {
      if (!state.room) {
        return prev;
      }

      return ({
        state: 'connected',
        proxy,
        room: state.room,

        // this is needed here as otherwise the old state is used
        broadcastMessage: (message) => {
          const payload: PeerMessageEnvelope = {
            message,
            timestamp: toISODateTime(new Date()),
          };

          Object
            .keys(state.room?.peers ?? {})
            .forEach((peerId) => {
            activePeerConnections.get(peerId)?.data?.send(payload);
            });

          proxy.publishOnPeerMessageSent(payload);
        },
      });
    });
  }, [state.room]);

  useEffect(() => () => {
    activePeerConnections.removeAll();

    // Destroy the PeerJS Server connection as well
    peerSDK.current?.destroy();
  }, []);


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
        if (msg.kind === 'joinRoomSuccess') {
          dispatch(
            createRoomAction({
              room: msg.content.room,
              me: msg.content.me,
            }),
          );

          const sdk = new PeerSDK(
            wNamespace(msg.content.me.id),
            config.SIGNALING_SERVER_CONFIG,
          );

          sdk.on('error', logsy.error);

          sdk.on('open', () => {
            // Connect to all Peers
            Object.values(msg.content.room.peers)
              .filter(({ id }) => id !== msg.content.me.id)
              .forEach((peer) => {
                const namespacedPeerId = wNamespace(peer.id);
                const pc = sdk.connect(namespacedPeerId);

                pc.on('error', logsy.error);

                pc.on('open', () => {
                  activePeerConnections.add(peer.id, { data: pc });

                  dispatch(addPeerAction(msg.content.room.peers[peer.id]));

                  navigator.mediaDevices
                    .getUserMedia({ video: true, audio: true })
                    .then((stream) => {
                      // TODO: This could be smarter a bit
                      dispatch(addMyStream({ stream }));

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
              activePeerConnections.add(peerId, { data: pc });

              dispatch(addPeerAction({
                id: peerId,
                name: 'TBD (will come from metadata)',
              }));
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
                  dispatch(addMyStream({ stream: localStream }));
                  dispatch(
                    addPeerStream({
                      peerId,
                      stream: remoteStream,
                    }),
                  );
                });
              });
          });

          peerSDK.current = sdk;
        }
      }}
      onReady={(socket) => {
        setContextState(() => ({
          state: 'connecting',
        }));

        socket.send({
          kind: 'joinRoomRequest',
          content: {
            roomId: props.roomCredentials.id,
            code: props.roomCredentials.code,
          },
        });
      }}
      render={() => (
        <PeerContext.Provider value={contextState}>
          {props.children}
        </PeerContext.Provider>
      )}
    />
  );
};