import { Dispatch } from 'redux';
import { resources } from 'src/resources';
import { UserInfoRecord } from 'dstnd-io';
import { setUserAction } from './actions';

// TODO: This needs to be revised in order to offer proper auth flow!
export const setUser = (
  userInfo: UserInfoRecord,
) => async (dispatch: Dispatch) => (
  await resources.registerPeer({ userInfo })
)
  .map(({ user }) => {
    // This shouldn't be done in this way!
    //  The Regiser Peer doesn't create the User but only registers it
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
