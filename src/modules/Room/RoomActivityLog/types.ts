import { RoomChallengeRecord, RoomWithWarGameActivityRecord, UserInfoRecord } from 'dstnd-io';
import { ISODateTime } from 'io-ts-isodatetime';
import { RoomWithPlayActivity } from 'src/providers/PeerProvider';

export type PlayOfferType = NonNullable<RoomWithPlayActivity['activity']['offer']>['type'];
export type WarOfferType = NonNullable<RoomWithWarGameActivityRecord['activity']['type']>;
export type DangerouslySetInnerHTML = { __html: string };

type BaseNotification = {
  id: string;
  timestamp: ISODateTime;
};

export type OfferNotification = BaseNotification & {
  type: 'offer';
  offerType: PlayOfferType | WarOfferType;
  byUser: UserInfoRecord;
  toUser: UserInfoRecord;
  status: 'pending' | 'withdrawn' | 'accepted';
};

export type ChallengeNotification = BaseNotification & {
  type: 'challenge';
  challengeType: 'open'; // specific to user
  byUser: UserInfoRecord;
  gameSpecs: RoomChallengeRecord['gameSpecs'];
  status: 'pending' | 'withdrawn' | 'accepted';
  challenge: RoomChallengeRecord;
};

export type InfoNotification = BaseNotification & {
  type: 'info';
  infoType: 'resign' | 'win' | 'draw' | 'newGame';
  content: string | DangerouslySetInnerHTML;
};

export type Notification = InfoNotification | OfferNotification | ChallengeNotification;
