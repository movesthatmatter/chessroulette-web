import { createAction } from 'deox';
import { UserRecord } from 'dstnd-io';

export const setUserAction = createAction(
  'setUserAction',
  (resolve) => (p: UserRecord) => resolve(p)
);
export const unsetUserAction = createAction('unsetUserAction');
