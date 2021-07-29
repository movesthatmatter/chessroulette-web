import React from 'react';
import { ContainerDimensions } from 'src/modules/Rooms/PlayRoom/Layouts/DesktopLayout/util';
import { AnalysisActivity } from '../AnalysisActivity';
import { NoActivity } from '../NoActivity';
import { PlayActivityContainer } from '../PlayActivity/PlayActivityContainer';
import { RoomActivity } from '../types';

type Props = {
  activity: RoomActivity;
  layout: {
    container: ContainerDimensions;
    board: ContainerDimensions;
  };
};

export const RoomActivityComponent: React.FC<Props> = ({ activity, layout }) => {
  if (activity.type === 'play') {
    return <PlayActivityContainer activity={activity} size={layout.board.width} />;
  }

  if (activity.type === 'analysis') {
    return <AnalysisActivity activity={activity} size={layout.board.width} />;
  }

  return <NoActivity size={layout.board.width} />;
};
