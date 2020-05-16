import React from 'react';
import StoryRouter from 'storybook-react-router';
import { AddNewPeerPopUp } from './AddNewPeerPopup';

export default {
  component: AddNewPeerPopUp,
  title: 'Components/Popups/Add New Peer Popup',
  decorators: [StoryRouter()],
};

export const NewPeerPopup = () => <AddNewPeerPopUp />;
