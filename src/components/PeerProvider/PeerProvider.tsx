import React, { useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import PeerSDK from 'peerjs';
import { PeerConnectionStatus } from 'src/services/peers';
import { PeerRecord } from 'dstnd-io';
import { SocketConsumer } from '../SocketProvider';
import { PeerConnections } from '../PeersProvider';
import { Peer } from '../RoomProvider';

const namespace = 'dstnd_';
const wNamespace = (s: string) => `${namespace}${s}`;
const woNamespace = (s: string) => (
  s.indexOf(namespace) > -1
    ? s.slice(namespace.length)
    : s
);

type RenderProps = {
  me: Peer;
  peers: Record<string, Peer>;
}

type Props = {
  render: (p: RenderProps) => React.ReactNode;
};

export const PeerProvider: React.FC<Props> = (props) => {
  const peerSDK = useRef<PeerSDK>();

  const [me, setMe] = useState<Peer | undefined>();
  const [peers, setPeers] = useState<Record<string, Peer>>({});
  // const [pcs, setPcs] = useState({});
  // const [peerConnections, setPeerConnections] = useState<PeerConnections>({});

  // useEffect(() => {
  //   const peer = new Peer();
  // }, []);

  useEffect(() => {
    console.log('Me Updated', me);
  }, [me]);

  useEffect(() => {
    console.log('Peers Updated', peers);
  }, [peers]);

  return (
    <SocketConsumer
      onMessage={(msg) => {
        if (msg.kind === 'joinRoomSuccess') {
          // This is only be called once if I'm right
          setMe({
            ...msg.content.me,
            avatarId: msg.content.me.id.slice(-1)[0],
            connection: {
              // This shouldn't be so
              // there's no connetion with myself :)
              channels: {
                data: { on: true },
                streaming: { on: false },
              },
            },
          });

          // console.log('[PeerProvider] my id', wNamespace(msg.content.me.id));

          const sdk = new PeerSDK(wNamespace(msg.content.me.id), {
            debug: 0,
            // host: '127.0.0.1',
            host: 'dstnd-signaling.herokuapp.com',
            port: 80,
            secure: false,
            // port: 443,
            // config: {

            // }
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

                  setPeers((prev) => ({
                    ...prev,
                    [peerId]: {
                      ...msg.content.room.peers[peerId],
                      avatarId: peerId.slice(-1)[0],
                      connection: {
                        channels: {
                          data: { on: true },
                          streaming: { on: false },
                        },
                      },
                    },
                  }));

                  // sdk.call(idWNamespace);

                  // calling
                  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                    .then((stream) => {
                      setMe((prev) => (!prev ? prev : ({
                        ...prev,
                        connection: {
                          ...prev.connection,
                          channels: {
                            ...prev.connection.channels,
                            streaming: {
                              on: true,
                              stream,
                              type: 'audio-video',
                            },
                          },
                        },
                      })));

                      const call = sdk.call(idWNamespace, stream);

                      call.on('stream',
                        (remoteStream) => {
                          console.log('Remote Stream Received', peerId);
                          setPeers((prev) => ({
                            ...prev,
                            [peerId]: {
                              ...prev[peerId],
                              connection: {
                                ...prev[peerId].connection,
                                channels: {
                                  ...prev[peerId].connection.channels,
                                  streaming: {
                                    on: true,
                                    type: 'audio-video', // this needs to be dynamic
                                    stream: remoteStream,
                                  },
                                },
                              },
                            },
                          }));
                          // Show stream in some <video> element.
                        });
                    }, (err) => {
                      console.error('Failed to get local stream', err);
                    });
                });
              });
          });

          // sdk.on('')

          console.log('sdk', sdk);

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
              pc.send(`hi back from ${msg.content.me.id}`);


              setPeers((prev) => ({
                ...prev,
                [peerId]: {
                  id: peerId,
                  name: `${peerId}'s Name`,
                  avatarId: peerId.slice(-1)[0],
                  connection: {
                    channels: {
                      data: { on: false },
                      streaming: { on: false },
                    },
                  },
                },
              }));
            });
          });

          sdk.on('call', (call) => {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
              .then((myStream) => {
                call.answer(myStream); // Answer the call with an A/V stream.
                call.on('stream', (remoteStream) => {
                  const peerId = woNamespace(call.peer);

                  console.log('received remote stream from', peerId);

                  setMe((prev) => (!prev ? prev : ({
                    ...prev,
                    connection: {
                      ...prev.connection,
                      channels: {
                        ...prev.connection.channels,
                        streaming: {
                          on: true,
                          stream: myStream,
                          type: 'audio-video',
                        },
                      },
                    },
                  })));


                  setPeers((prev) => ({
                    ...prev,
                    [peerId]: {
                      ...prev[peerId],
                      connection: {
                        ...prev[peerId].connection,
                        channels: {
                          ...prev[peerId].connection.channels,
                          streaming: {
                            on: true,
                            type: 'audio-video', // this needs to be dynamic
                            stream: remoteStream,
                          },
                        },
                      },
                    },
                  }));

                  // setPeers((prev) => ({
                  //   ...prev,
                  //   [peerId]:
                  // }))
                  // call.metadata;
                  // Show stream in some <video> element.
                });
              }, (err) => {
                console.error('Failed to get local stream', err);
              });
          });

          console.log('[PeerProvider] me', sdk.id);


          peerSDK.current = sdk;
        }
      }}
      onReady={(socket) => socket.send({
        kind: 'joinRoomRequest',
        content: {
          roomId: '1',
          code: undefined,
        },
      })}
      render={() => (
        <>
          {me && props.render({
            peers, me,
          })}
        </>
      )}
    />
  );
};
