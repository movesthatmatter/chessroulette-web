import React, {
  useEffect, useRef, useReducer,
} from 'react';
import PeerSDK from 'peerjs';
import { logsy } from 'src/lib/logsy';
import config from 'src/config';
import { SocketConsumer } from '../SocketProvider';
import { Room } from '../RoomProvider';
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

type RenderProps = {
  room: Room;
}

export type PeerProviderProps = {
  roomCredentials: {
    id: string;
    code?: string;
  };
  render: (p: RenderProps) => React.ReactNode;
};

export const PeerProvider: React.FC<PeerProviderProps> = (props) => {
  const peerSDK = useRef<PeerSDK>();
  const activePeerConnections = useRef(new ActivePeerConnections()).current;
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => () => {
    activePeerConnections.removeAll();

    // Destroy the PeerJS Server connection as well
    peerSDK.current?.destroy();
  }, []);

  return (
    <SocketConsumer
      onMessage={(msg) => {
        if (msg.kind === 'joinRoomSuccess') {
          dispatch(createRoomAction({
            room: msg.content.room,
            me: msg.content.me,
          }));

          const sdk = new PeerSDK(wNamespace(msg.content.me.id), config.SIGNALING_SERVER_CONFIG);

          sdk.on('error', logsy.error);

          sdk.on('open', () => {
            // Connect to all Peers
            Object
              .values(msg.content.room.peers)
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
                        dispatch(addPeerStream({
                          peerId: peer.id,
                          stream: remoteStream,
                        }));
                      });

                      activePeerConnections.add(peer.id, {
                        media: {
                          connection: call,
                          localStream: stream,
                        },
                      });
                    });
                });

                pc.on('close', () => {
                  dispatch(removePeerAction({ peerId: peer.id }));

                  activePeerConnections.remove(peer.id);
                });
              });
          });


          sdk.on('connection', (pc) => {
            const peerId = woNamespace(pc.peer);

            pc.on('error', logsy.error);

            pc.on('data', (data) => {
              console.log('[PeerProvider] received data', data);
            });

            pc.on('open', () => {
              dispatch(addPeerAction({
                id: peerId,
                name: 'TBD (will come from metadata)',
              }));
            });

            pc.on('close', () => {
              dispatch(removePeerAction({ peerId }));

              activePeerConnections.remove(peerId);
            });

            activePeerConnections.add(peerId, { data: pc });
          });

          sdk.on('close', () => {
            console.log('SDK on close');
          });

          sdk.on('disconnected', () => {
            console.log('SDK on disconnected');
          });

          sdk.on('call', (call) => {
            const peerId = woNamespace(call.peer);

            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
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
                  dispatch(addPeerStream({
                    peerId,
                    stream: remoteStream,
                  }));
                });
              });
          });

          peerSDK.current = sdk;
        }
      }}
      onReady={(socket) => socket.send({
        kind: 'joinRoomRequest',
        content: {
          roomId: props.roomCredentials.id,
          code: props.roomCredentials.code,
        },
      })}
      render={() => (
        <>
          {state.room && props.render({ room: state.room })}
        </>
      )}
    />
  );
};
