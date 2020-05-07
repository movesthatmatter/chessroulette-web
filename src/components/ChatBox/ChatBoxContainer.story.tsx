/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react';
import { getPublicRooms } from 'src/modules/Lobby/resources';
import {
  PublicRoomsResponsePayload,
  RoomStatsRecord,
  PeerRecord,
} from 'dstnd-io';
import { SocketClient } from 'src/services/socket/SocketClient';
import { ChatBoxContainer } from './ChatBoxContainer';
import { SocketProvider, SocketConsumer } from '../SocketProvider';

export default {
  component: ChatBoxContainer,
  title: 'Components/ChatBoxContainer',
};

// TODO: Sometimes when it makes send it would be worth
//  investigating some ways to mock the need to need the server
//  to run these stories
export const defaultStory = () =>
  React.createElement(() => {
    const [socket, setSocket] = useState<SocketClient | undefined>(undefined);
    // These need to be mocked but it's pretty impossible for now
    const [publicRooms, setPublicRooms] = useState<PublicRoomsResponsePayload>(
      [],
    );
    // const [joiningRoomId, setJoinedRoomId] = useState<string | undefined>(undefined);
    const [joinedRoom, setJoinedRoom] = useState<RoomStatsRecord | undefined>(
      undefined,
    );
    const [me, setMe] = useState<PeerRecord | undefined>(undefined);

    useEffect(() => {
      (async () => {
        const res = await getPublicRooms();

        res.map(setPublicRooms);
      })();
    }, []);

    useEffect(() => {
      if (socket && !joinedRoom && publicRooms.length > 0) {
        socket.send({
          kind: 'joinRoomRequest',
          content: {
            roomId: publicRooms[0].id,
          },
        });
      }
    }, [socket, publicRooms, joinedRoom]);

    return (
      <SocketProvider>
        <SocketConsumer
          onReady={setSocket}
          onMessage={(msg) => {
            if (msg.kind === 'joinRoomSuccess') {
              setJoinedRoom(msg.content.room);
              setMe(msg.content.me);
            }
          }}
          render={() => (
            <>
              {joinedRoom && me && (
                <>
                  <ChatBoxContainer
                    peers={Object.values(joinedRoom.peers)}
                    me={me}
                  />
                </>
              )}
            </>
          )}
        />
      </SocketProvider>
    );
  });
