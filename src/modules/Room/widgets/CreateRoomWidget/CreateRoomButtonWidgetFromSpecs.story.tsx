/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { CreateRoomButtonWidgetFromSpecs } from './CreateRoomButtonWidgetFromSpecs';

export default {
  component: CreateRoomButtonWidgetFromSpecs,
  title: 'modules/Room/widgets/CreateRoomButtonWidgetFromSpecs',
};

export const defaultStory = () => (
  <CreateRoomButtonWidgetFromSpecs
    label="CreateRoom"
    createRoomSpecs={{
      activity: {
        activityType: 'analysis',
        source: 'archivedGame',
        gameId: '23',
      },
      type: 'room',
      isPrivate: true,
    }}
  />
);
