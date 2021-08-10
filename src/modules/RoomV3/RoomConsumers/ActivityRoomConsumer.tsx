import React, { useContext } from 'react';
// import { AnalysisActivity } from 'src/modules/Room/Activities/AnalysisActivity';
// import { NoActivity } from 'src/modules/Room/Activities/NoActivity';
// import { PlayActivityContainer } from 'src/modules/Room/Activities/PlayActivity/PlayActivityContainer';
// import { ContainerDimensions } from 'src/modules/Rooms/PlayRoom/Layouts/DesktopLayout/util';
import { NoActivity } from '../RoomActivity/activities/NoActivity';
import { PlayActivity } from '../RoomActivity/activities/PlayActivity';
import { AnalysisActivity } from '../RoomActivity/activities/AnalysisActivity';
import { RoomProviderContext } from '../RoomProvider';

type Props = {};

export const ActivityRoomConsumer: React.FC<Props> = () => {
  const context = useContext(RoomProviderContext);

  console.log('[RoomV3] ActivityRoomConsumer', context);

  if (!context) {
    // Loader
    return null;
  }

  const { currentActivity } = context.room;

  if (currentActivity.type === 'play') {
    return <PlayActivity activity={currentActivity} deviceSize={context.deviceSize} />;
  }

  if (currentActivity.type === 'analysis') {
    // currentActivity.participants['2'].participant.
    return <AnalysisActivity activity={currentActivity} deviceSize={context.deviceSize} />;
  }

  return <NoActivity deviceSize={context.deviceSize} />;
};
