import React, { useContext } from 'react';
import { NoActivity } from '../RoomActivity/activities/NoActivity';
import { PlayActivity } from '../RoomActivity/activities/PlayActivity';
import { AnalysisActivity } from '../RoomActivity/activities/AnalysisActivity';
import { RoomProviderContext } from '../RoomProvider';

type Props = {};

export const ActivityRoomConsumer: React.FC<Props> = () => {
  const context = useContext(RoomProviderContext);

  if (!context) {
    // Loader
    return null;
  }

  const { currentActivity } = context.room;

  if (currentActivity.type === 'play') {
    return <PlayActivity activity={currentActivity} deviceSize={context.deviceSize} />;
  }

  if (currentActivity.type === 'analysis') {
    return <AnalysisActivity activity={currentActivity} deviceSize={context.deviceSize} />;
  }

  return <NoActivity deviceSize={context.deviceSize} />;
};
