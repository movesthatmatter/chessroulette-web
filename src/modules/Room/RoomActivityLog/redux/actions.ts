import { createAction } from 'deox';
import { RoomActivityRecord } from 'dstnd-io';
import { Notification, OfferNotification } from '../types';

export const addNotificationAction = createAction(
  'AddNotification',
  (resolve) => (p: { notification: Notification }) => resolve(p)
);

type NonPendingOfferNotificationStatus = Exclude<OfferNotification['status'], 'pending'>;

export const resolveOfferNotificationAction = createAction(
  'ResolveOfferNotification',
  (resolve) => (p: {
    notificationId: Notification['id'];
    status: NonPendingOfferNotificationStatus;
  }) => resolve(p)
);

export const clearLogAction = createAction('ClearLog');

export const clearActivityLogForAllButActivity = createAction(
  'ClearSpecificActivityLog',
  (resolve) => (p : {activity: RoomActivityRecord['type']}) => resolve(p)
)
