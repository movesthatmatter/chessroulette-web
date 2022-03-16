import React, { useCallback, useEffect, useState } from 'react';
import { GameStateDialogProvider } from 'src/modules/Games/components/GameStateDialog';
import { GameProvider } from 'src/modules/Games/Providers/GameProvider/GameProvider';
import { useDispatch } from 'react-redux';
import { Game } from 'src/modules/Games';
import { RoomMatchActivity } from '../../types';
import { updateJoinedGameAction } from '../../../../redux/actions';
import { PlayActivity, RoomPlayActivity } from '../../../PlayActivity';
import { convertMatchActivityIntoPlayActivity } from '../../utils';
import { useRoomConsumer } from 'src/modules/Room/RoomConsumers/useRoomConsumer';
import { ActivityCommonProps } from '../../../types';

type Props = ActivityCommonProps & {
  activity: RoomMatchActivity;
};

export const MatchActivityContainer: React.FC<Props> = ({ activity, ...props }) => {
  const dispatch = useDispatch();
  const roomContext = useRoomConsumer();
  const [roomActivity, setRoomActivity] = useState(
    convertMatchActivityIntoPlayActivity(activity, roomContext!.room)
  );

  useEffect(() => {
    if (roomContext) {
      setRoomActivity(convertMatchActivityIntoPlayActivity(activity, roomContext.room));
    }
  }, [activity]);

  const onGameUpdated = useCallback(
    (nextGame: Game) => {
      dispatch(updateJoinedGameAction(nextGame));
    },
    [dispatch]
  );

  return (
    <GameProvider onGameUpdated={onGameUpdated}>
      {roomActivity.game ? (
        <GameStateDialogProvider
          dialogNotificationTypes={props.deviceSize.isMobile ? 'all' : 'not-during-started-game'}
          activity={roomActivity}
        >
          <PlayActivity activity={roomActivity} {...props} />
        </GameStateDialogProvider>
      ) : null}
    </GameProvider>
  );
};
