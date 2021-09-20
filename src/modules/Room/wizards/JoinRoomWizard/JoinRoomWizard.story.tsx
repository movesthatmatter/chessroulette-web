/* eslint-disable import/no-extraneous-dependencies */
import { action } from '@storybook/addon-actions';
import React from 'react';
import { FunWallpaper } from 'src/components/FunWallpaper/FunWallpaper';
import { ChallengeMocker, UserInfoMocker } from 'src/mocks/records';
import { RoomMocker } from 'src/mocks/records/RoomMocker';
import { StorybookBaseProvider } from 'src/storybook/StorybookBaseProvider';
import { colors, floatingShadow, softBorderRadius } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { JoinRoomWizard } from './JoinRoomWizard';

export default {
  component: JoinRoomWizard,
  title: 'modules/room/Wizards/JoinRoomWizard',
};

const userMocker = new UserInfoMocker();
const roomMocker = new RoomMocker();
const challengeMocker = new ChallengeMocker();

export const withPendingChallenge = () => {
  const challenge = challengeMocker.record();
  const room = roomMocker.withProps({
    pendingChallenges: {
      [challenge.id]: {
        ...challenge,
        roomId: '23',
      },
    },
  });

  return (
    <StorybookBaseProvider>
      <FunWallpaper
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 320,
            background: colors.white,
            padding: spacers.large,
            ...softBorderRadius,
            ...floatingShadow,
          }}
        >
          <JoinRoomWizard
            roomInfo={room}
            onFinished={action('on finished')}
            myUser={userMocker.record()}
          />
        </div>
      </FunWallpaper>
    </StorybookBaseProvider>
  );
};
