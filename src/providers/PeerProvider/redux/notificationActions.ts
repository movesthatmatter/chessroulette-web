import { createAction } from 'deox';
import { Notification, OfferNotification } from '../types';

export const addNotification = createAction(
  'AddNotification',
  (resolve) => (p: { notification: Notification }) => resolve(p)
);

export const updateOfferNotification = createAction(
  'UpdateOfferNotification',
  (resolve) => (p: { notificationId: Notification['id'], status: OfferNotification['status'] }) => resolve(p)
);

export const resolveNotification = createAction(
  'ResolveNotification',
  (resolve) => (p: { id: string; resolution: boolean }) => resolve(p)
);

export const clearLog = createAction('ClearLog');
