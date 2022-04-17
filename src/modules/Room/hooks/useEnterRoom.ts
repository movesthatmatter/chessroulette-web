import { RoomRecord } from 'chessroulette-io';
import { useHistory } from 'react-router-dom';
import { toRoomUrlPath } from 'src/lib/util';

export const useEnterRoom = () => {
  const history = useHistory();

  return (room: RoomRecord) => history.push(toRoomUrlPath(room));
};
