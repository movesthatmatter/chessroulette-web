import { createAction } from 'deox';
import { Notification, OfferNotification } from '../types';

export const addNotificationAction = createAction(
  'AddNotification',
  (resolve) => (p: { notification: Notification }) => resolve(p)
);

export const updateOfferNotificationAction = createAction(
  'UpdateOfferNotification',
  (resolve) => (p: { notificationId: Notification['id']; status: OfferNotification['status'] }) =>
    resolve(p)
);

export const clearLogAction = createAction('ClearLog');
