import { GuestUserInfoRecord, RegisteredUserRecord } from 'dstnd-io';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Button } from 'src/components/Button';
import { noop } from 'src/lib/util';
import { UserInfoMocker } from 'src/mocks/records';
import { spacers } from 'src/theme/spacers';
import { UserProfileShowcase } from './UserProfileShowcase';

export default {
  component: UserProfileShowcase,
  title: 'modules/UserProfile/widgets/UserProfileShowcaseWidget/comonents/UserProfileShowcase',
};

const userInfoMock = new UserInfoMocker();

const guest = userInfoMock.withProps({ isGuest: true }) as GuestUserInfoRecord;
const registered = userInfoMock.withProps({ isGuest: false }) as RegisteredUserRecord;

export const asGuest = () => (
  <div
    style={{
      width: 400,
    }}
  >
    <UserProfileShowcase
      isGuest
      user={guest}
      callToActionComponent={() => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: spacers.default,
          }}
        >
          <Button label="Play" type="primary" onClick={noop} />
          <Button label="Analyise" type="positive" onClick={noop} />
        </div>
      )}
    />
  </div>
);

export const asRegistered = () => (
  <div
    style={{
      width: 400,
    }}
  >
    <UserProfileShowcase
      isGuest={false}
      user={registered}
      stats={{ 
        wins: 23,
        loses: 45,
        draws: 2,
        gamesCount: 121,
        userId: registered.id,
      }}
      callToActionComponent={() => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: spacers.default,
          }}
        >
          <Button label="Play" type="primary" onClick={noop} />
          <Button label="Analyise" type="positive" onClick={noop} />
        </div>
      )}
    />
  </div>
);
