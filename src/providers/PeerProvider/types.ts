import {
  PeerRecord,
  RoomRecord,
  RoomWithPlayActivityRecord,
  RoomWithNoActivityRecord,
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

type Value<T, K extends keyof T> = T[K];

export type OfferType = Value<
  Pick<NonNullable<RoomWithPlayActivity['activity']['offer']>, 'type'>,
  'type'
> | 'resign' | 'win' | 'loss';

export type Notification = {
  id: string;
  timestamp: ISODateTime; 
  type: OfferType;
  content: string;
  // buttons?: Pick<ButtonProps, 'type' | 'label'>[];
  // resolved?: undefined | boolean;
};

export type Room = RoomRecord & {
  me: Peer;
  peers: Record<string, Peer>;
  peersCount: number;

  peersIncludingMe: Record<string, Peer>;
};

export type RoomWithNoActivity = Room & Pick<RoomWithNoActivityRecord, 'activity'>;
export type RoomWithPlayActivity = Room & Pick<RoomWithPlayActivityRecord, 'activity'>;
