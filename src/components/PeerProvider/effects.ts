import { Dispatch } from 'redux';
import { SocketClient } from 'src/services/socket/SocketClient';

export const joinRoom = (
  socketClient: SocketClient,
  credentials: {
    roomId: string;
    code: string | undefined;
  },
) => (dispatch: Dispatch) => {
  socketClient.send({
    kind: 'joinRoomRequest',
    content: credentials,
  });
};
