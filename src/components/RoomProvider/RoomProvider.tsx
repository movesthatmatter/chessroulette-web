import React, {
  useState, ReactNode, useEffect, useRef,
} from 'react';
import {
  PeerRecord, RoomStatsRecord, IceServerRecord,
} from 'dstnd-io';
import { PeerMessageEnvelope } from 'src/services/peers';
import { AVStreamingConstraints, AVStreaming } from 'src/services/AVStreaming';
import { noop } from 'src/lib/util';
import { resources } from 'src/resources';
import { SocketConsumer } from '../SocketProvider';
import { PeersProvider, PeerConnections } from '../PeersProvider';
import { Room, Peer } from './types';


type RenderProps = {
  me: Peer;
  room: Room;

  startStreaming: (constraints?: AVStreamingConstraints) => void;
  stopStreaming: () => void;
  broadcastMessage: (m: PeerMessageEnvelope['message']) => void;
}

type Props = {
  id: string;
  code?: string;

  render: (p: RenderProps) => ReactNode;
  renderFallback: (p: {
    error: Errors | undefined;
    loading: boolean;
  }) => ReactNode;

  onMessageReceived?: PeersProvider['props']['onPeerMsgReceived'];
  onMessageSent?: PeersProvider['props']['onPeerMsgSent'];
};

type Errors = 'WrongCode';

export const RoomProvider: React.FC<Props> = ({
  onMessageReceived = noop,
  onMessageSent = noop,
  ...props
}) => {
  const avStreamClient = useRef(new AVStreaming());

  const [iceServers, setIceServers] = useState<IceServerRecord[] | undefined>();
  const [localStream, setLocalStream] = useState<MediaStream | undefined>();
  const [error, setError] = useState<Errors | undefined>();
  const [
    socketRecords,
    setSocketRecords,
  ] = useState<{me: PeerRecord; room: RoomStatsRecord} | undefined>();
  const [rtcPeerConnections, setRtcPeerConnections] = useState<PeerConnections>({});
  const [meAndMyRoom, setMeAndMyRoom] = useState<{me: Peer; room: Room} | undefined>();

  useEffect(() => {
    // Sync the Socket Peers and the RTC Peers together
    setMeAndMyRoom((prev) => {
      // If there is no socketRoom just yet or it somehow closed leave the prev
      if (!socketRecords) {
        return prev;
      }

      const meId = socketRecords.me.id;

      const nextMe: Peer = {
        // Updates From Socket
        id: meId,
        name: socketRecords.me.name,
        avatarId: meId.slice(-1)[0],

        // Updates From RTC (Peer Connections)
        connection: {
          channels: {
            // This is fake and I don't like it being here
            data: { on: false },
            streaming: localStream
              ? {
                on: true,
                type: 'audio-video',
                stream: localStream,
              }
              : { on: false },
          },
        },
      };

      // The rule for now is that the PeerConnections are taking precedence over Room.peers
      //  For ex: If a Socket Peer drops but there is still an active RTC PeerConnection to it,
      //   that peer will stay
      //  If a new Socket Peer joins, but there isn't an active RTC Connection to it yet,
      //   it will not show up
      const nextPeers: Room['peers'] = Object
        .keys(rtcPeerConnections)
        // Take me out from peers
        .filter((peerId) => peerId !== nextMe.id)
        .reduce((res, peerId) => {
          // TODO: Revise this logic here as I'm not sure it's working as it should
          //  or at the very least I'm not sure it's not extraneous, like the 2nd if


          if (socketRecords.room.peers[peerId]) {
            const { room: socketRoom } = socketRecords;
            const { [peerId]: socketRoomPeer } = socketRoom.peers;
            const { [peerId]: rtcConnection } = rtcPeerConnections;

            const nextPeer: Peer = {
              id: socketRoomPeer.id,
              name: socketRoomPeer.name,
              // Thiis should come from somewhere else lowerver (server or smtg)
              avatarId: socketRoomPeer.id.slice(-1)[0],

              connection: {
                channels: rtcConnection.channels,
              },
            };

            return {
              ...res,
              [peerId]: nextPeer,
            };
          }

          // If it's a new one
          if (prev?.room.peers[peerId]) {
            return {
              ...res,
              [peerId]: prev.room.peers[peerId],
            };
          }

          return res;
        }, {});

      const nextRoom: Room = {
        // Updates from Socket
        id: socketRecords.room.id,
        name: socketRecords.room.name,
        ...socketRecords.room.type === 'private' ? {
          type: socketRecords.room.type,
          code: socketRecords.room.code,
        } : {
          type: socketRecords.room.type,
        },

        // Updates from RTC (Peer Connections)
        me: nextMe,
        peers: nextPeers,
        peersCount: Object.keys(nextPeers).length,

        peersIncludingMe: {
          ...nextPeers,
          [nextMe.id]: nextMe,
        },
      };

      return {
        me: nextMe,
        room: nextRoom,
      };
    });
  }, [rtcPeerConnections, socketRecords, localStream]);

  useEffect(() => {
    (async () => {
      // Try to get and set the IceServers on mount
      // TODO: This could be cached here and on the server as well
      (await resources.getIceURLS()).map(setIceServers);
    })();
  }, []);

  return (
    <SocketConsumer
      onMessage={(msg) => {
        if (msg.kind === 'joinRoomSuccess') {
          setSocketRecords(msg.content);
        } else if (msg.kind === 'joinRoomFailure') {
          setError('WrongCode');
        } else if (msg.kind === 'roomStats') {
          // This is needed because when there is a new Peer Joining the room
          //  The Peer Info comes from the socket
          setSocketRecords((prev) => (prev
            ? ({
              ...prev,
              room: msg.content,
            })
            // If prev isn't defined yet, just return it
            // it means somehow it didn't have a chance to setMe so this payload
            //  won't suffice. If this happens it's an error!
            : prev
          ));
        }

        // TODO: Is there a need for onLeave??
      }}
      onReady={(socket) => socket.send({
        kind: 'joinRoomRequest',
        content: {
          roomId: props.id,
          code: props.code,
        },
      })}
      render={({ socket }) => (
        <>
          {(socketRecords && iceServers)
            ? (
              <PeersProvider
                socket={socket}
                iceServers={iceServers}

                meId={socketRecords.me.id}
                initialPeerIds={Object.keys(socketRecords.room.peers)}
                onReady={({ connect, startStreaming }) => {
                // Connect to all the peers right away
                  connect();

                  // And start streaming
                  (async () => {
                    const nextLocalStream = await avStreamClient.current.start();

                    setLocalStream((prev) => {
                      // If there is a local stram running already don't change anything
                      if (prev) {
                        return prev;
                      }

                      return nextLocalStream;
                    });
                    startStreaming(nextLocalStream);
                  })();
                }}

                // Start a new local stream everytime it's needed
                onLocalStreamRequested={() => avStreamClient.current.start()}
                onPeerConnectionsChanged={setRtcPeerConnections}
                onPeerMsgReceived={onMessageReceived}
                onPeerMsgSent={onMessageSent}

                render={({
                  startStreaming,
                  stopStreaming,
                  broadcastMessage,
                }) => (meAndMyRoom
                  ? props.render({
                    me: meAndMyRoom.me,
                    room: meAndMyRoom.room,

                    startStreaming: async (constraints) => {
                      const nextLocalStream = await avStreamClient.current.start(constraints);

                      setLocalStream((prev) => {
                        // If there is a local stram running already don't change anything
                        if (prev) {
                          return prev;
                        }

                        return nextLocalStream;
                      });
                      startStreaming(nextLocalStream);
                    },
                    stopStreaming: () => {
                      stopStreaming();

                      // Stop the local client as well
                      // TODO: Do I need to stop each RTC's Connection stream too?
                      // I'd suppose I do
                      if (localStream) {
                        avStreamClient.current.stop(localStream);
                      }
                    },
                    broadcastMessage,
                  })
                  : props.renderFallback({ error, loading: !error }))}
              />
            )
            : props.renderFallback({ error, loading: !error })}
        </>
      )}
    />
  );
};
