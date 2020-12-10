import { Grommet } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { Button } from 'src/components/Button';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
import { defaultTheme } from 'src/theme';
import { GenericRoomBouncer } from './GenericRoomBouncer';

export default {
  component: GenericRoomBouncer,
  title: 'modules/GenericRoom/GenericRoomBouncer',
};

export const defaultStory = () =>
  React.createElement(() => {
    // const state = useState();
    const [show, setShow] = useState(false);

    return (
      <Grommet theme={defaultTheme}>
        <StorybookReduxProvider
          initialState={{
            roomBouncer: {
              confirmedRoomJoin: false,
              permissionsGranted: false,
              permissionsRequestAgreed: false,
              ready: false,
            },
          }}
        >
          <Button label="Join Room" onClick={() => setShow(true)} />
          {show && (
            <GenericRoomBouncer onCancel={() => setShow(false)}/>
          )}
        </StorybookReduxProvider>
      </Grommet>
    );
  });
