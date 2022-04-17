import { useCallback, useEffect, useState } from 'react';
import { CreateRoomRequest } from 'chessroulette-io';
import { useAnyUser } from 'src/services/Authentication';
import { useHistory } from 'react-router-dom';
import { toRoomUrlPath } from 'src/lib/util';
import { Events } from 'src/services/Analytics';
import * as resources from '../../resources';
import { AsyncErr, AsyncResult } from 'ts-async-results';

export const useCreateRoom = (
  createRoomSpecs: Pick<CreateRoomRequest, 'type' | 'activity' | 'p2pCommunicationType'>
) => {
  const user = useAnyUser();
  const history = useHistory();

  const createRoom = useCallback(() => {
    if (!user) {
      return AsyncErr.EMPTY;
    }

    return resources
      .createRoom({
        userId: user.id,
        ...createRoomSpecs,
      })
      .map(
        AsyncResult.passThrough((room) => {
          Events.trackRoomCreated(room);
          history.push(toRoomUrlPath(room));
        })
      );
  }, [user?.id, createRoomSpecs]);

  const [state, setState] = useState({
    isReady: !!user,
    createRoom,
  });

  useEffect(() => {
    setState({
      isReady: !!user,
      createRoom,
    });
  }, [user?.id, createRoom]);

  return state;
};
