import React from 'react';
import { UserRecord } from 'dstnd-io';
import { Button, IconButton } from 'src/components/Button';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { colors, fonts } from 'src/theme';
import cx from 'classnames';
import { getUserDisplayName } from 'src/modules/User';
import { spacers } from 'src/theme/spacers';
import { OfferNotification } from '../../types';
import { Avatar } from 'src/components/Avatar';
import { Checkmark, Close, FormClose } from 'grommet-icons';

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
  'offer-rematch-pending': (n: OfferNotification) => (
    <div>
      <strong>{getUserDisplayName(n.byUser)}</strong> is asking{' '}
      <strong>{getUserDisplayName(n.toUser)}</strong> for a rematch
    </div>
  ),
  'offer-rematch-withdrawn': (n: OfferNotification) => (
    <div>
      <strong>{getUserDisplayName(n.byUser)}</strong>'s rematch offer was sent into the void
    </div>
  ),
  'offer-rematch-accepted': (n: OfferNotification) => (
    <div>
      <strong>{getUserDisplayName(n.toUser)}</strong> accepted{' '}
      <strong>{getUserDisplayName(n.byUser)}</strong>'s rematch offer
    </div>
  ),
  'offer-draw-pending': (n: OfferNotification) => (
    <div>
      <strong>{getUserDisplayName(n.byUser)}</strong> is offering{' '}
      <strong>{getUserDisplayName(n.toUser)}</strong> a draw
    </div>
  ),
  'offer-draw-withdrawn': (n: OfferNotification) => (
    <div>
      <strong>{getUserDisplayName(n.byUser)}</strong>'s draw offer was sent into the void
    </div>
  ),
  'offer-draw-accepted': (n: OfferNotification) => (
    <div>
      <strong>{getUserDisplayName(n.toUser)}</strong> accepted the draw offer
    </div>
  ),
  'offer-challenge-pending': (n: OfferNotification) => (
    <div>
      <strong>{getUserDisplayName(n.byUser)}</strong> is challenging{' '}
      <strong>{getUserDisplayName(n.toUser)}</strong> to a new game.
    </div>
  ),
  'offer-challenge-withdrawn': (n: OfferNotification) => (
    <div>
      <strong>{getUserDisplayName(n.byUser)}</strong>'s challenge offer was sent into the void
    </div>
  ),
  'offer-challenge-accepted': (n: OfferNotification) => (
    <div>
      <strong>{getUserDisplayName(n.toUser)}</strong> accepted{' '}
      <strong>{getUserDisplayName(n.byUser)}</strong>'s challenge offer
    </div>
  ),
};

const getContent = (notification: OfferNotification): React.ReactNode => {
  const key = `${notification.type}-${notification.offerType}-${notification.status}`;

  return dict[key as keyof typeof dict](notification);
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
        <div
          style={{
            display: 'flex',
            flexDirection: notification.byUser.id === me.id ? 'row' : 'row-reverse',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: notification.byUser.id === me.id ? 'row' : 'row-reverse',
            }}
          >
            <Avatar
              mutunachiId={Number(notification.byUser.avatarId)}
              className={cx({
                [cls.avatarLeft]: notification.byUser.id !== me.id,
                [cls.avatarRight]: notification.byUser.id === me.id,
              })}
            />
            <div
              style={{
                textAlign: notification.byUser.id === me.id ? 'left' : 'right',
              }}
            >
              {content}
            </div>
          </div>
          {notification.status === 'pending' && notification.byUser.id === me.id && (
            <IconButton
              type="primary"
              icon={Close}
              className={cls.attentionButton}
              clear
              onSubmit={() => props.onCancelOffer(notification)}
            />
          )}
        </div>

        {notification.status === 'pending' && notification.toUser.id === me.id && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: spacers.small,
            }}
          >
            <IconButton
              type="primary"
              icon={Close}
              className={cls.denyButton}
              clear
              onSubmit={() => props.onDenyOffer(notification)}
            />
            <IconButton
              type="primary"
              icon={Checkmark}
              className={cls.attentionButton}
              // clear
              onSubmit={() => props.onAcceptOffer(notification)}
            />
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
    borderRight: `3px solid ${colors.negativeLight}`,
    paddingRight: spacers.default,
  },
  avatarLeft: {
    marginLeft: spacers.small,
  },
  avatarRight: {
    marginRight: spacers.small,
  },
  denyButton: {
    marginRight: spacers.small,
    height: '30px',
    width: '30px',
    ...makeImportant({
      marginBottom: 0,
    }),
  },
  attentionButton: {
    height: '30px',
    width: '30px',
    ...makeImportant({
      marginBottom: 0,
    }),
  },
});
