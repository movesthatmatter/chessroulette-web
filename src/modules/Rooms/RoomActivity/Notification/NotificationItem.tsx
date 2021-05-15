import capitalize from 'capitalize';
import { format } from 'date-fns';
import { UserRecord } from 'dstnd-io';
import { ISODateTime } from 'io-ts-isodatetime';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, ButtonProps } from 'src/components/Button';
import { createUseStyles } from 'src/lib/jss';
import { noop } from 'src/lib/util';
import { getOppositePlayer, getPlayerByColor } from 'src/modules/GameRoomV2/util';
import { Game } from 'src/modules/Games';
import {
  InfoNotification,
  Notification,
  OfferNotification,
  selectActivityLog,
} from 'src/providers/PeerProvider';
import { colors, fonts } from 'src/theme';

type Props = {
  notification: Notification;
  me: UserRecord;
  game: Game;
  onCancelOffer: (n: OfferNotification) => void;
  onAcceptOffer: (n: OfferNotification) => void;
  onDenyOffer: (n: OfferNotification) => void;
};

function returnCurrentDate(time: ISODateTime): string {
  return format(new Date(time), 'HH:mm:s a');
}

export const NotificationItem: React.FC<Props> = ({ notification, game, me, ...props }) => {
  const cls = useStyles();
  const hasButtons =
    notification.type === 'offer' &&
    notification.status === 'pending' &&
    !!{
      [notification.byUser.id]: true,
      [notification.toUser.id]: true,
    }[me.id];

  const content = ((notification) => {
    if (notification.type === 'offer') {
    const key = `${notification.type}-${notification.offerType}-${notification.status}`
        
    console.log('notification ->', notification);
    console.log('key -> ', key);
    const dict = {
      'offer-rematch-pending': (n: OfferNotification) =>
        `${n.byUser.name} is asking ${n.toUser.name} for a rematch`,
      'offer-rematch-withdrawn': (n: OfferNotification) =>
        `${n.byUser.name}'s rematch offer was sent into the void`,
      'offer-rematch-accepted': (n: OfferNotification) =>
        `${n.toUser.name} accepted the rematch offer`,

      'offer-draw-pending': (n: OfferNotification) =>
        `${n.byUser.name} is offering ${n.toUser.name} a draw`,
      'offer-draw-withdrawn': (n: OfferNotification) =>
        `${n.byUser.name}'s draw offer was sent into the void`,
      'offer-draw-accepted': (n: OfferNotification) => `${n.toUser.name} accepted the draw offer`,
    };

    return dict[key as keyof typeof dict](notification as any);
  }
  })(notification);

  return (
    <div className={cls.container}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'right',
        }}
      >
        {notification.type === 'info' ? notification.content : content}

        {hasButtons && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: '10px',
            }}
          >
            {notification.type === 'offer' && notification.byUser.id === me.id && (
              <Button
                type="secondary"
                label="Cancel"
                style={{ marginRight: '10px' }}
                size="xsmall"
                onClick={() => props.onCancelOffer(notification)}
              />
            )}
            {notification.type === 'offer' && notification.toUser.id === me.id && (
              <>
                <Button
                  type="secondary"
                  label="Deny"
                  style={{ marginRight: '10px' }}
                  size="xsmall"
                  onClick={() => props.onDenyOffer(notification)}
                />
                <Button
                  type="primary"
                  label="Accept"
                  style={{ marginRight: '10px' }}
                  size="xsmall"
                  onClick={() => props.onAcceptOffer(notification)}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    ...fonts.small1,
    marginBottom: '24px',
    // borderLeft: `3px solid ${colors.attention}`,
  },
});
