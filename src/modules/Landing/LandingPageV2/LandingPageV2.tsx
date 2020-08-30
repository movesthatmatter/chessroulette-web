import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Page } from 'src/components/Page';
import { GameRoomV2Container } from 'src/modules/GameRoomV2/GameRoomV2Container/GameRoomV2Container';
import { GameRoomV2 } from 'src/modules/GameRoomV2/GameRoomV2';
import { PeerMocker } from 'src/mocks/records/PeerMocker';

type Props = {};

const peerMocker = new PeerMocker();

export const LandingPageV2: React.FC<Props> = () => {
  const [me, setMe] = useState(peerMocker.record());

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setMe((prev) => ({
          ...prev,
          connection: {
            ...prev.connection,
            channels: {
              ...prev.connection.channels,
              streaming: {
                on: true,
                type: 'audio-video',
                stream,
              },
            },
          },
        }));
      });
  }, []);

  // For now the Landing Page simply impersonates a GameRoom
  return (
    <Page>
      <GameRoomV2 me={me} />
    </Page>
  );
};
