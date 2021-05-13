import capitalize from 'capitalize';
import { format } from 'date-fns';
import { UserRecord } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, ButtonProps } from 'src/components/Button';
import { createUseStyles } from 'src/lib/jss';
import { noop } from 'src/lib/util';
import { Notification, OfferNotification, selectActivityLog } from 'src/providers/PeerProvider';

type Props = {
  notification: Notification;
  me: UserRecord;

  onCancelOffer: (n: OfferNotification) => void;
  onAcceptOffer: (n: OfferNotification) => void;
  onDenyOffer: (n: OfferNotification) => void;
};

function returnCurrentDate(): string {
  return format(new Date(), 'HH:MM:ss a');
}

export const NotificationItem: React.FC<Props> = ({
  notification,
  me,
  ...props
}) => {
  const cls = useStyles();

  const hasButtons =
    notification.type === 'offer' &&
    notification.status === 'pending' &&
    !!{
      [notification.byUser.id]: true,
      [notification.toUser.id]: true,
    }[me.id];

  const content = ((notification) => {
    const key = notification.type === 'offer'
    ? `${notification.type}-${notification.offerType}-${notification.status}`
    : `${notification.type}-${notification.infoType}`

    const dict = ({
      'offer-rematch-pending': (n: OfferNotification) => `${n.byUser.name} is asking ${n.toUser.name} for a rematch`,
      'offer-rematch-withdrawn': (n: OfferNotification) => `${n.byUser.name}'s rematch offer was sent into the void`,
      'offer-rematch-accepted': (n: OfferNotification) => `${n.toUser.name} accepted the rematch offer`,

      'offer-draw-pending': (n: OfferNotification) => `${n.byUser.name} is offering ${n.toUser.name} a draw`,
      'offer-draw-withdrawn': (n: OfferNotification) => `${n.byUser.name}'s draw offer was sent into the void`,
      'offer-draw-accepted': (n: OfferNotification) => `${n.toUser.name} accepted the draw offer`,

      // TODO: add the info ones as well
    });

    return dict[key as keyof typeof dict](notification as any);
  })(notification);

  return (
    <div className={cls.container}>
      <div
        style={{
          display: 'flex',
          flexDirection: hasButtons ? 'column' : 'row',
          justifyContent: 'space-between',
        }}
      >
        {content}
        
        {hasButtons && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            {notification.type === 'offer' && notification.byUser.id === me.id && (
              <Button
                type="secondary"
                label="Cancel"
                style={{ marginRight: '10px' }}
                size="small"
                onClick={() => props.onCancelOffer(notification)}
              />
            )}
            {notification.type === 'offer' && notification.toUser.id === me.id && (
              <>
              <Button
                type="secondary"
                label="Deny"
                style={{ marginRight: '10px' }}
                size="small"
                onClick={() => props.onDenyOffer(notification)}
              />
              <Button
                type="primary"
                label="Accept"
                style={{ marginRight: '10px' }}
                size="small"
                onClick={() => props.onAcceptOffer(notification)}
              />
              </>
            )}
            {/* {notification.buttons.map((button) => (
              <Button {...button} style={{ marginRight: '10px' }} size="small" onClick={noop} />
            ))} */}
          </div>
        )}
        <div>{returnCurrentDate()}</div>
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
});
