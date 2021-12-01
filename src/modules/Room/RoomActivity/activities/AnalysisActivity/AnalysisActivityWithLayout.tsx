import React, { useCallback } from 'react';
import { GenericLayoutDesktopRoomConsumer } from 'src/modules/Room/RoomConsumers/GenericLayoutDesktopRoomConsumer';
import {
  AnalysisActivityContainer,
  AnalysisActivityContainerProps,
} from './AnalysisActivityContainer';

type Props = Pick<AnalysisActivityContainerProps, 'activity' | 'deviceSize'>;

export const AnalysisActivityWithLayout: React.FC<Props> = (props) => {
  const renderActivity = useCallback(
    ({ boardSize, leftSide }) => (
      <AnalysisActivityContainer {...props} boardSize={boardSize} leftSide={leftSide} />
    ),
    [props.activity]
  );

  return <GenericLayoutDesktopRoomConsumer renderActivity={renderActivity} />;
};
