import { format } from 'date-fns';
import { ISODateTime } from 'io-ts-isodatetime';
import { toISODate } from './ISODate';


export const now = () => new Date();
export const getNow = () => new Date();

export const shortFormat = (d: Date) => toISODate(format(d, 'yyyy-MM-dd'));

export const ISODateTimeToTimestamp = (i: ISODateTime) => new Date(i).getTime();