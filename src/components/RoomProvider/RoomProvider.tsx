import React, { useState, ReactNode, useEffect } from 'react';
import { PeerRecord, RoomStatsRecord } from 'dstnd-io';
import { PeerMessageEnvelope } from 'src/services/peers';
import { AVStreamingConstraints } from 'src/services/AVStreaming';
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
};

type Errors = 'WrongCode';

export const RoomProvider: React.FC<Props> = (props) => {
  const [error, setError] = useState<Errors | undefined>();
  const [
    socketRecords,
    setSocketRecords,
  ] = useState<{me: PeerRecord; room: RoomStatsRecord} | undefined>();
  const [rtcPeerConnections, setRtcPeerConnections] = useState<PeerConnections>({});

  // const [me, setMe] = useState<Peer | undefined>();
  // const [room, setRoom] = useState<Room | undefined>();

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
          ...rtcPeerConnections[meId]
            ? { channels: rtcPeerConnections[meId].channels }
            : {
              channels: {
                data: { on: false },
                streaming: { on: false },
              },
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
        // Take out me from peers
        .filter((peerId) => peerId !== nextMe.id)
        .reduce((res, peerId) => {
          if (!prev?.room.peers[peerId] && socketRecords.room.peers[peerId]) {
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
        peers: nextPeers,
        peersCount: Object.keys(nextPeers).length,
      };

      return {
        me: nextMe,
        room: nextRoom,
      };
    });
  }, [rtcPeerConnections, socketRecords]);

  return (
    <SocketConsumer
      onMessage={(msg) => {
        if (msg.kind === 'joinRoomSuccess') {
          setSocketRecords(msg.content);
        } else if (msg.kind === 'joinRoomFailure') {
          setError('WrongCode');
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
          {(socketRecords)
            ? (
              <PeersProvider
                socket={socket}
                me={socketRecords.me}
                initialPeers={Object.values(socketRecords.room.peers)}
                onReady={({ connect }) => {
                // Connect to all the peers right away
                  connect();
                }}
                onPeerConnectionsChanged={setRtcPeerConnections}
                // TODO: This might b more useful as a map

                render={({
                  startAVBroadcasting,
                  stopAVBroadcasting,
                  broadcastMessage,
                }) => (meAndMyRoom
                  ? props.render({
                    me: meAndMyRoom.me,
                    room: meAndMyRoom.room,
                    startStreaming: () => startAVBroadcasting(),
                    stopStreaming: stopAVBroadcasting,
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
