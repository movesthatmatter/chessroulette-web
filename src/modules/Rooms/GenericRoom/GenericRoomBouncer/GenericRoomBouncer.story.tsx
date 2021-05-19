import { Grommet } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { Button } from 'src/components/Button';
import { RoomMocker } from 'src/mocks/records/RoomMocker';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
import { defaultTheme } from 'src/theme';
import { GenericRoomBouncer } from './GenericRoomBouncer';

export default {
  component: GenericRoomBouncer,
  title: 'modules/GenericRoom/GenericRoomBouncer',
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
              browserIsSupported: false,
              ready: false,
            },
          }}
        >
          <Button label="Join Room" onClick={() => setShow(true)} />
          {show && (
            <GenericRoomBouncer onCancel={() => setShow(false)} roomInfo={roomMocker.record()} />
          )}
        </StorybookReduxProvider>
      </Grommet>
    );
  });
