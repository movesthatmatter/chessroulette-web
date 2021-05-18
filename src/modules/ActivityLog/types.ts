import { UserInfoRecord } from 'dstnd-io';
import { ISODateTime } from 'io-ts-isodatetime';
import { RoomWithPlayActivity } from 'src/providers/PeerProvider';

export type OfferType = NonNullable<RoomWithPlayActivity['activity']['offer']>['type'];

type BaseNotification = {
  id: string;
  timestamp: ISODateTime;
};

export type OfferNotification = BaseNotification & {
  type: 'offer';
  offerType: OfferType;
  byUser: UserInfoRecord;
  toUser: UserInfoRecord;
  status: 'pending' | 'withdrawn' | 'accepted';
};

export type InfoNotification = BaseNotification & {
  type: 'info';
  infoType: 'resign' | 'win' | 'draw' | 'newGame';
  content: string;
};

export type Notification = OfferNotification | InfoNotification;
