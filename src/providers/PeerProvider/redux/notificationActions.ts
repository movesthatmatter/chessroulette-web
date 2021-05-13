import { createAction } from "deox";
import {Notification} from '../types';

export const addNotification = createAction('SetNotification', 
    (resolve) => (p: {notification: Notification}) => resolve(p));
export const resolveNotification = createAction('ResolveNotification',
    (resolve) => (p : {id :string, resolution: boolean}) => resolve(p))
export const clearLog = createAction('ClearLog');
