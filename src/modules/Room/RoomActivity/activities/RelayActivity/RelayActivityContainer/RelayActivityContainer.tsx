import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Game } from 'src/modules/Games';
import { GameProvider } from 'src/modules/Games/Providers/GameProvider/GameProvider';
import { DeviceSize } from 'src/theme/hooks/useDeviceSize';
import { updateJoinedGameAction } from '../../../redux/actions';
import { RelayActivity } from '../RelayActivity/RelayActivity';
import { RoomRelayActivity } from '../types';

type Props = {
  activity: RoomRelayActivity;
  deviceSize: DeviceSize;
};

export const RelayActivityContainer: React.FC<Props> = ({activity, deviceSize}) => {

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
          <RelayActivity activity={activity} deviceSize={deviceSize}/>
      ) : null}
    </GameProvider>
  );
};
