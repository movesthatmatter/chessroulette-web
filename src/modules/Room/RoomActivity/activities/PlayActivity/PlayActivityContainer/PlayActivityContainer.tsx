import React, { useCallback } from 'react';
import { PlayActivity } from '../PlayActivity';
import { GameStateDialogProvider } from 'src/modules/Games/components/GameStateDialog';
import { PlayActivityProps } from '../PlayActivity/PlayActivity';
import { RoomPlayActivity } from '../types';
import { GameProvider } from 'src/modules/Games/Providers/GameProvider/GameProvider';
import { useDispatch } from 'react-redux';
import { updateJoinedGameAction } from '../../../redux/actions';
import { Game } from 'src/modules/Games';

type Props = Omit<PlayActivityProps, 'activity'> & {
  activity: RoomPlayActivity;
};

export const PlayActivityContainer: React.FC<Props> = ({ activity, ...props }) => {
  const dispatch = useDispatch();
  const onGameUpdated = useCallback(
    (nextGame: Game) => {
      dispatch(updateJoinedGameAction(nextGame));
    },
    [dispatch]
  );

  return (
    <GameProvider onGameUpdated={onGameUpdated}>
      {activity.game ? (
        <GameStateDialogProvider
          dialogNotificationTypes={props.deviceSize.isMobile ? 'all' : 'not-during-started-game'}
          activity={activity}
        >
          <PlayActivity activity={activity} {...props} />
        </GameStateDialogProvider>
      ) : null}
    </GameProvider>
  );
};
