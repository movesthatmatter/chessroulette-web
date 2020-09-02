import { Dispatch } from 'redux';
import { resources } from 'src/resources';
import { UserRecord } from 'dstnd-io';
import { setUserAction } from './actions';

// TODO: This needs to be revised in order to offer proper auth flow!
export const setUser = (userId: UserRecord['id']) => async (dispatch: Dispatch) => (
  await resources.registerPeer({ userId })
)
  .map(({ user }) => {
    dispatch(setUserAction(user));

    return user;
  });

export const setGuest = () => async (dispatch: Dispatch) => (
  await resources.getGuestUserRegisteredAsPeer()
)
  .mapErr((e) => {
    console.log('set guest error', e);
  })
  .map((peer) => {
    console.log('set guest success', peer.user);
    dispatch(setUserAction(peer.user));

    return peer.user;
  });
