import { RoomActivityRecord, RoomChallengeRecord, UserInfoRecord } from 'dstnd-io';
import { ISODateTime } from 'io-ts-isodatetime';
import React from 'react';
import { ButtonProps } from 'src/components/Button';
import { RoomWithPlayActivity } from 'src/providers/PeerProvider';
import { RoomActivity } from '../RoomActivity/types';

export type OfferType = NonNullable<RoomWithPlayActivity['activity']['offer']>['type'];
export type DangerouslySetInnerHTML = { __html: string };

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

export type InfoNotificationWithAction = Omit<InfoNotification, 'infoType' | 'type'> & {
  type: 'infoWithAction',
  actionContent: React.ReactNode;
  activityId: string;
}

export type RoomSpecificNotifications = BaseNotification & {
  type: 'roomSpecific',
  activity: Exclude<RoomActivityRecord['type'], | 'none'>;
  content: string | DangerouslySetInnerHTML;
  activityId: string;
  actionContent?: React.ReactNode
}

export type Notification = InfoNotification | OfferNotification | ChallengeNotification | RoomSpecificNotifications;
