import {
  PeerRecord,
  RoomRecord,
  RoomWithPlayActivityRecord,
  RoomWithNoActivityRecord,
  UserInfoRecord,
} from 'dstnd-io';
import { ISODateTime } from 'io-ts-isodatetime';
import { ButtonProps } from 'src/components/Button';
import { PeerConnectionStatus } from 'src/services/peers';

export type RoomCredentials = {
  id: string;
  code?: string;
};

export type Peer = PeerRecord & {
  connection: {
    channels: PeerConnectionStatus['channels'];
  };
};

export type OfferType = NonNullable<RoomWithPlayActivity['activity']['offer']>['type']

type BaseNotification = {
  id: string;
  timestamp: ISODateTime;
  content: string;
}

export type OfferNotification = BaseNotification & {
  type: 'offer',
  offerType: OfferType;
  byUser: UserInfoRecord;
  toUser: UserInfoRecord;
  status: 'pending' | 'withdrawn' | 'accepted';
};

export type InfoNotification = BaseNotification & {
  type: 'info',
  infoType: 'resign' | 'win' | 'loss' | 'cancel' | 'accept';
};

export type Notification = OfferNotification | InfoNotification;

// export type RematchOfferNotification = BaseNotification & {
//   type: 'rematchOffer';
//   byUser: UserInfoRecord;
//   toUser: UserInfoRecord;
// };

// export type DrawNotification = BaseNotification & {
//   type: 'drawOffer';
//   byUser: UserInfoRecord;
//   toUser: UserInfoRecord;
// };

// export type Notification = {
//   id: string;
//   timestamp: ISODateTime; 
//   content: string;
//   type: OfferType | 'resign' | 'win' | 'loss';
//   // buttons?: Pick<ButtonProps, 'type' | 'label'>[];
//   // resolved?: undefined | boolean;
// };


export type Room = RoomRecord & {
  me: Peer;
  peers: Record<string, Peer>;
  peersCount: number;

  peersIncludingMe: Record<string, Peer>;
};

export type RoomWithNoActivity = Room & Pick<RoomWithNoActivityRecord, 'activity'>;
export type RoomWithPlayActivity = Room & Pick<RoomWithPlayActivityRecord, 'activity'>;
