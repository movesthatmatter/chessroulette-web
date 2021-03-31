import { Dispatch } from 'redux';
import { updateUserAction } from './actions';
import { getUser, connectExternalAccount } from 'src/services/Authentication/resources';

export const updateAuthenticatedUser = () => async (dispatch: Dispatch) => {
  return getUser().map((user) => {
    dispatch(updateUserAction({ user }));

    return user;
  });
};

export const connectExternalAccountEffect = (req: Parameters<typeof connectExternalAccount>[0]) => (
  dispatch: Dispatch
) => {
  return connectExternalAccount(req).map((user) => {
    dispatch(updateUserAction({ user }));
  });
};
