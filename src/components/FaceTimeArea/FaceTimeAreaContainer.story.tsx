/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { JoinFirstAvailableRoomHelper } from 'src/storybook/JoinDefaultRoomHelper';
import { FaceTimeAreaContainer } from './FaceTimeAreaContainer';
import { SocketProvider } from '../SocketProvider';


export default {
  component: FaceTimeAreaContainer,
  title: 'components/FaceTimeAreaContainer',
};

export const defaultStory = () => (
  <SocketProvider>
    <JoinFirstAvailableRoomHelper
      autoDemandConnection={false}
      fallbackRender={({ open }) => (
        <button
          onClick={open}
          type="button"
        >
          Enter Room on Demand
        </button>
      )}
      render={({ room, me }) => (
        <>
          {me.name}
          <FaceTimeAreaContainer
            peers={Object.values(room.peers)}
            me={me}
          />
        </>
      )}
    />
  </SocketProvider>
);
