import React from 'react';
import StoryRouter from 'storybook-react-router';
import { SocketProvider } from 'src/components/SocketProvider';
import { RoomNotAvailablePopup } from './RoomNotAvailablePopup';

export default {
  component: RoomNotAvailablePopup,
  title: 'Components/Popups/Room Not Available',
  decorators: [StoryRouter()],
};

export const RoomNotAvailable = () => React.createElement(() => (
  <div style={{ display: 'flex', width: '400px' }}>
    <SocketProvider>
      <RoomNotAvailablePopup />
    </SocketProvider>
  </div>
));
