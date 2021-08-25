import { Grommet } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { Button } from 'src/components/Button';
import { RoomMocker } from 'src/mocks/records/RoomMocker';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
import { defaultTheme } from 'src/theme';
import { RoomBouncer } from './RoomBouncer';

export default {
  component: RoomBouncer,
  title: 'modules/Room/Bouncer/RoomBouncer',
};

const roomMocker = new RoomMocker();

export const defaultStory = () =>
  React.createElement(() => {
    // const state = useState();
    const [show, setShow] = useState(false);

    return (
      <Grommet theme={defaultTheme}>
        <StorybookReduxProvider
          initialState={{
            roomBouncer: {
              confirmedRoomJoin: {
                roomSlug: '1',
                status: false,
              },
              permissionsGranted: false,
              permissionsRequestAgreed: false,
              browserIsUnsupported: true,
              ready: false,
            },
          }}
        >
          <Button label="Join Room" onClick={() => setShow(true)} />
          {show && <RoomBouncer onCancel={() => setShow(false)} roomInfo={roomMocker.record()} />}
        </StorybookReduxProvider>
      </Grommet>
    );
  });