import { CreateRoomRequest } from 'dstnd-io';
import { Dispatch } from 'redux';
import { resources } from 'src/resources';
import { setUserAction } from './actions';


export const setUser = (
  userInfo: {name: string},
) => async (dispatch: Dispatch) => (
  // TODO: Remove the user creation from here
  await resources.createUser(userInfo)
)
  .map((user) => {
    dispatch(setUserAction(user));

    return user;
  });

// export const createRoom = (roomCredentials: CreateRoomRequest) => (dispatch: Dispatch) => {
//   createRoom({
//                     nickname: 'my room',
//                     type: 'private',
//                     peerId: user.id,
//                   })
// }
