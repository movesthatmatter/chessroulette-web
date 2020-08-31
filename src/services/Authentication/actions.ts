import { createAction } from 'deox';
import { UserInfoRecord } from 'dstnd-io';

export const setUserAction = createAction(
  'setUserAction',
  (resolve) => (p: UserInfoRecord) => resolve(p),
);
export const unsetUserAction = createAction('unsetUserAction');
