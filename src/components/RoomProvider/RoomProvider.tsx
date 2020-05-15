import React, { useState, ReactNode, useEffect } from 'react';
import { PeerRecord, RoomStatsRecord } from 'dstnd-io';
import { PeerMessageEnvelope } from 'src/services/peers';
import { AVStreamingConstraints } from 'src/services/AVStreaming';
import { noop } from 'src/lib/util';
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

      console.log('[PeersRoomProvider] Inside State Update: prev', prev);
      console.log('[PeersRoomProvider] Inside State Update: rtcPeerConnections', rtcPeerConnections);
      console.log('[PeersRoomProvider] Inside State Update: socketConnections', socketRecords.room.peers);
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
          console.log('[PeersRoomProvider] Inside State Update: in peer reducer for peer', peerId);
          // If it's a new Opened RTC Connection add it
          // if (!prev?.room.peers[peerId] && socketRecords.room.peers[peerId]) {
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
          } if (prev?.room.peers[peerId]) {
            return {
              ...res,
              [peerId]: prev.room.peers[peerId],
            };
          }

          console.log('[PeersRoomProvider] Inside State Update: in the else', !prev?.room.peers[peerId] && socketRecords.room.peers[peerId], res);

          return res;
        }, {});


      console.log('[PeersRoomProvider] Inside State Update: nextPeers', nextPeers);

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
      };

      console.log('[PeersRoomProvider] Inside State Update: nextRoom', nextRoom);

      return {
        me: nextMe,
        room: nextRoom,
      };
    });
  }, [rtcPeerConnections, socketRecords]);

  useEffect(() => {
    console.log('[PeersRoomProvider] socketRecords updated', socketRecords);
  }, [socketRecords]);

  useEffect(() => {
    console.log('[PeersRoomProvider] meAndMyRoom updated', meAndMyRoom?.room);
  }, [meAndMyRoom]);

  return (
    <SocketConsumer
      onMessage={(msg) => {
        console.log('[PeersRoomProvider] socket consumer onMessage', msg);
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
          {(socketRecords)
            ? (
              <PeersProvider
                socket={socket}
                meId={socketRecords.me.id}
                initialPeerIds={Object.keys(socketRecords.room.peers)}
                onReady={({ connect, startAVBroadcasting }) => {
                // Connect to all the peers right away
                  connect();

                  // setTimeout(() => {
                  //   startAVBroadcasting();
                  // }, 3 * 1000);
                }}
                onPeerConnectionsChanged={(p) => {
                  console.log('[PeersRoomProvider] onPeerConnectionsChanged', p);
                  setRtcPeerConnections(p);
                }}
                onPeerMsgReceived={onMessageReceived}
                onPeerMsgSent={onMessageSent}

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
