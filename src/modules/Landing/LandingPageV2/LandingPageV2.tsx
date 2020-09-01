import React, { useState, useEffect } from 'react';
import { Page } from 'src/components/Page';
import { GameRoomV2 } from 'src/modules/GameRoomV2/GameRoomV2';
import { PeerMocker } from 'src/mocks/records/PeerMocker';
import { RoomMocker } from 'src/mocks/records/RoomMocker';
import { Peer } from 'src/components/RoomProvider';

type Props = {};

const peerMocker = new PeerMocker();
const roomMocker = new RoomMocker();

export const LandingPageV2: React.FC<Props> = () => {
  const [room, setRoom] = useState(roomMocker.record(0));

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setRoom((prev) => {
          // TODO: This should actually use the authenticated user info or the guest info!

          const me: Peer = {
            ...prev.me,
            connection: peerMocker.withChannels({
              streaming: {
                on: true,
                type: 'audio-video',
                stream,
              },
            }).connection,
          };

          return {
            ...prev,
            me,
            peersIncludingMe: {
              ...prev.peersIncludingMe,
              [me.id]: me,
            },
          };
        });
      });
  }, []);

  // For now the Landing Page simply impersonates a GameRoom
  return (
    <Page>
      <GameRoomV2 room={room} />
    </Page>
  );
};
