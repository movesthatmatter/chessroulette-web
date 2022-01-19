import React, { useCallback } from 'react';
import { GameStateDialogProvider } from 'src/modules/Games/components/GameStateDialog';
import { RoomWarGameActivity } from '../types';
import { useDispatch } from 'react-redux';
import { updateJoinedWarGameAction } from '../../../redux/actions';
import { WarGame } from 'src/modules/Games';
import { WarGameActivity, WarGameActivityProps } from '../WarGameActivity/WarGameActivity';
import { WarGameProvider } from 'src/modules/Games/WarGame/WarGameProvider/WarGameProvider';

type Props = Omit<WarGameActivityProps, 'activity'> & {
  activity: RoomWarGameActivity;
};

export const WarGameActivityContainer: React.FC<Props> = ({ activity, ...props }) => {
  const dispatch = useDispatch();
  const onGameUpdated = useCallback(
    (nextGame: WarGame) => {
      dispatch(updateJoinedWarGameAction(nextGame));
    },
    [dispatch]
  );

  return (
    <WarGameProvider onGameUpdated={onGameUpdated}>
      {activity.game ? (
          <WarGameActivity activity={activity} {...props} />
      ) : null}
    </WarGameProvider>
  );
};
