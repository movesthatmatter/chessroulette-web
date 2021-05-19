import React from 'react';
import { UserRecord } from 'dstnd-io';
import { Button } from 'src/components/Button';
import { createUseStyles } from 'src/lib/jss';
import { colors, fonts } from 'src/theme';
import cx from 'classnames';
import { getUserDisplayName } from 'src/modules/User';
import { spacers } from 'src/theme/spacers';
import { OfferNotification } from '../../types';

type Props = {
  notification: OfferNotification;
  className?: string;
  me: UserRecord;
  onCancelOffer: (n: OfferNotification) => void;
  onAcceptOffer: (n: OfferNotification) => void;
  onDenyOffer: (n: OfferNotification) => void;
};

/// TODO: I'm not happy with this as it doesn't fail at compile time!
const dict = {
  'offer-rematch-pending': (n: OfferNotification) =>
    `${getUserDisplayName(n.byUser)} is asking ${getUserDisplayName(n.toUser)} for a rematch`,
  'offer-rematch-withdrawn': (n: OfferNotification) =>
    `${getUserDisplayName(n.byUser)}'s rematch offer was sent into the void`,
  'offer-rematch-accepted': (n: OfferNotification) =>
    `${getUserDisplayName(n.toUser)} accepted ${getUserDisplayName(n.byUser)}'s rematch offer`,
  'offer-draw-pending': (n: OfferNotification) =>
    `${getUserDisplayName(n.byUser)} is offering ${getUserDisplayName(n.toUser)} a draw`,
  'offer-draw-withdrawn': (n: OfferNotification) =>
    `${getUserDisplayName(n.byUser)}'s draw offer was sent into the void`,
  'offer-draw-accepted': (n: OfferNotification) =>
    `${getUserDisplayName(n.toUser)} accepted the draw offer`,
  'offer-challenge-pending': (n: OfferNotification) =>
    `${getUserDisplayName(n.byUser)} is challenging ${getUserDisplayName(
      n.toUser
    )} to a new game. TODO: Add Game Specs`,
  'offer-challenge-withdrawn': (n: OfferNotification) =>
    `${getUserDisplayName(n.byUser)}'s challenge offer was sent into the void`,
  'offer-challenge-accepted': (n: OfferNotification) =>
    `${getUserDisplayName(n.toUser)} accepted ${getUserDisplayName(n.byUser)}'s challenge offer`,
};

const getContent = (notification: OfferNotification) => {
  const key = `${notification.type}-${notification.offerType}-${notification.status}`;

  return dict[key as keyof typeof dict](notification as any);
};

export const OfferNotificationItem: React.FC<Props> = ({
  notification,
  me,
  className,
  ...props
}) => {
  const cls = useStyles();

  const content = getContent(notification);

  const needsAttention = notification.status === 'pending' && notification.toUser.id === me.id;

  return (
    <div className={cx(cls.container, needsAttention && cls.attention, className)}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          textAlign:
            notification.byUser.id === me.id && notification.status === 'pending'
              ? 'left'
              : 'right',
        }}
      >
        {content}

        {notification.status === 'pending' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent:
                notification.byUser.id === me.id && notification.status === 'pending'
                  ? 'flex-start'
                  : 'flex-end',
              marginTop: spacers.small,
            }}
          >
            {notification.byUser.id === me.id && (
              <Button
                type="secondary"
                label="Cancel"
                size="xsmall"
                style={{ marginBottom: 0 }}
                onClick={() => props.onCancelOffer(notification)}
              />
            )}
            {notification.toUser.id === me.id && (
              <>
                <Button
                  type="secondary"
                  label="Deny"
                  style={{ marginRight: spacers.small, marginBottom: 0 }}
                  size="xsmall"
                  onClick={() => props.onDenyOffer(notification)}
                />
                <Button
                  type="primary"
                  label="Accept"
                  size="xsmall"
                  style={{ marginBottom: 0 }}
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
    marginBottom: spacers.large,
  },
  attention: {
    borderRight: `5px solid ${colors.negative}`,
    paddingRight: spacers.default,
  },
});
