import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'src/components/Button';
import { ContainerDimensions } from 'src/modules/Rooms/PlayRoom/Layouts/DesktopLayout/util';
import { AnalysisActivity } from '../AnalysisActivity';
import { NoActivity } from '../NoActivity';
import { PlayActivityContainer } from '../PlayActivity/PlayActivityContainer';
import { switchRoomActivityAction } from '../redux/actions';
import { RoomActivity } from '../redux/types';

type Props = {
  activity: RoomActivity;
  containerDimensions: ContainerDimensions;
};

export const RoomActivityComponent: React.FC<Props> = ({ activity, containerDimensions }) => {
  const dispatch = useDispatch();

  if (activity.type === 'play') {
    return (
      <>
        <PlayActivityContainer activity={activity} size={containerDimensions.width} />
        {/* <Button
          label="Analysis"
          onClick={() => {
            // props.onChangeRoomActivity('play');
            dispatch(
              switchRoomActivityAction({
                type: 'analysis',
                analysisId: 'asda',
              })
            );
          }}
        /> */}
      </>
    );
  }

  if (activity.type === 'analysis') {
    return (
      <>
        <AnalysisActivity size={containerDimensions.width} />
        {/* <Button
          label="Play"
          onClick={() => {
            // props.onChangeRoomActivity('play');
            dispatch(
              switchRoomActivityAction({
                type: 'play',
                gameId: 'asd',
              })
            );
          }}
        /> */}
      </>
    );
  }

  return <NoActivity size={containerDimensions.width} />;
};
