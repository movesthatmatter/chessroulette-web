/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Button } from 'src/components/Button';
import { noop } from 'src/lib/util';
import { UserInfoMocker } from 'src/mocks/records';
import { spacers } from 'src/theme/spacers';
import { UserProfileShowcaseWidget } from './UserProfileShowcaseWidget';

export default {
  component: UserProfileShowcaseWidget,
  title: 'modules/UserProfile/widgets/UserProfileShowcaseWidget',
};

const userInfoMock = new UserInfoMocker();

const userA = userInfoMock.record();

export const defaultStory = () => (
  <div
    style={{
      width: 400,
    }}
  >
    <UserProfileShowcaseWidget
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
