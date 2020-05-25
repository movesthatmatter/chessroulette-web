import React, {
  useEffect, useRef, useReducer,
} from 'react';
import PeerSDK from 'peerjs';
import { SocketConsumer } from '../SocketProvider';
import { Room } from '../RoomProvider';
import {
  initialState, reducer, createRoomAction, addPeerAction, addMyStream, addPeerStream,
} from './reducer';

const namespace = 'dstnd_';
const wNamespace = (s: string) => `${namespace}${s}`;
const woNamespace = (s: string) => (
  s.indexOf(namespace) > -1
    ? s.slice(namespace.length)
    : s
);

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
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    console.log('[Peer Provider] state updated', state);
  }, [state]);

  return (
    <SocketConsumer
      onMessage={(msg) => {
        console.log('on msg', msg);
        if (msg.kind === 'joinRoomSuccess') {
          dispatch(createRoomAction({
            room: msg.content.room,
            me: msg.content.me,
          }));

          const sdk = new PeerSDK(wNamespace(msg.content.me.id), {
            debug: 0,
            host: '127.0.0.1',
            port: 9000,
            // host: 'dstnd-signaling.herokuapp.com',
            secure: false,
          });

          sdk.on('open', () => {
            console.log('OPEN');

            console.log('Connecting to all peers', Object.keys(msg.content.room.peers));
            // connect to all the peers
            Object
              .keys(msg.content.room.peers)
              .filter((peerId) => peerId !== msg.content.me.id)
              .forEach((peerId) => {
                const idWNamespace = wNamespace(peerId);
                console.log('[PeerProvider] connecting to peer', idWNamespace);
                const pc = sdk.connect(idWNamespace);

                pc.on('error', (e) => {
                  console.warn('[PeerProvider] PC Error', e);
                });

                pc.on('open', () => {
                  console.log('[PeerProvider] connection opened', idWNamespace);

                  pc.send(`hi from ${msg.content.me.id}`);
                  dispatch(addPeerAction(msg.content.room.peers[peerId]));

                  // calling
                  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                    .then((stream) => {
                      dispatch(addMyStream({ stream }));

                      const call = sdk.call(idWNamespace, stream);

                      call.on('stream',
                        (remoteStream) => {
                          console.log('Remote Stream Received', peerId);

                          dispatch(addPeerStream({
                            peerId,
                            stream: remoteStream,
                          }));
                          // Show stream in some <video> element.
                        });
                    }, (err) => {
                      console.error('Failed to get local stream', err);
                    });
                });
              });
          });

          sdk.on('error', (e) => {
            console.warn('[PeerProvider] SDK Error', e);
          });

          sdk.on('connection', (pc) => {
            const peerId = woNamespace(pc.peer);

            console.log('[Peer Provider] connection', pc);

            pc.on('data', (data) => {
              console.log('[PeerProvider] received data', data);
            });

            pc.on('open', () => {
              console.log('[PeerProvider] on open sending message back');

              dispatch(addPeerAction({
                id: peerId,
                name: 'This is not given yet',
              }));
            });
          });

          sdk.on('call', (call) => {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
              .then((myStream) => {
                call.answer(myStream); // Answer the call with an A/V stream.
                call.on('stream', (remoteStream) => {
                  const peerId = woNamespace(call.peer);

                  dispatch(addMyStream({ stream: myStream }));
                  dispatch(addPeerStream({
                    peerId,
                    stream: remoteStream,
                  }));
                });
              }, (err) => {
                console.error('Failed to get local stream', err);
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
