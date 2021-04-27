import { createAction } from 'deox';
import { GuestUserRecord, RegisteredUserRecord } from 'dstnd-io';

export const setUserAction = createAction(
  'setUserAction',
  (resolve) => (p: {
    user: RegisteredUserRecord;
    accessToken: string;
  }) => resolve(p),
);

export const updateUserAction = createAction(
  'updateUserAction',
  (resolve) => (p: {
    user: RegisteredUserRecord;
  }) => resolve(p),
);

export const unsetUserAction = createAction('unsetUserAction');

export const setGuestUserAction = createAction(
  'setGuestUserAction',
  (resolve) => (p: GuestUserRecord) => resolve(p),
);
