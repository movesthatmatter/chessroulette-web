import React from 'react';
import { UserRecord } from 'dstnd-io';
import { IconButton } from 'src/components/Button';
import { createUseStyles, CSSProperties, makeImportant } from 'src/lib/jss';
import { CustomTheme, fonts } from 'src/theme';
import cx from 'classnames';
import { getUserDisplayName } from 'src/modules/User';
import { spacers } from 'src/theme/spacers';
import { OfferNotification } from '../../types';
import { Checkmark, Close } from 'grommet-icons';
import { PeerAvatar } from 'src/providers/PeerProvider/components/PeerAvatar';
import Loader from 'react-loaders';

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
  'offer-takeback-pending': (n: OfferNotification) => (
    <div>
      <strong>{getUserDisplayName(n.byUser)}</strong> is asking{' '}
      <strong>{getUserDisplayName(n.toUser)}</strong> for a takeback
    </div>
  ),
  'offer-takeback-accepted': (n: OfferNotification) => (
    <div>
      <strong>{getUserDisplayName(n.toUser)}</strong> accepted the takeback request
    </div>
  ),
  'offer-takeback-withdrawn': (n: OfferNotification) => (
    <div>
      <strong>{getUserDisplayName(n.byUser)}</strong>'s request was sent into the void
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

  const isToMe = notification.toUser.id === me.id;
  const isByMe = notification.byUser.id === me.id;
  const needsAttention = notification.status === 'pending' && isToMe;

  return (
    <div className={cx(cls.container, needsAttention && cls.attention, className)}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          textAlign: isByMe && notification.status === 'pending' ? 'left' : 'right',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: isByMe ? 'row' : 'row-reverse',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: isByMe ? 'row' : 'row-reverse',
            }}
          >
            <PeerAvatar
              peerUserInfo={notification.byUser}
              className={cx({
                [cls.avatarLeft]: !isByMe,
                [cls.avatarRight]: isByMe,
              })}
            />
            <div
              style={{
                textAlign: isByMe ? 'left' : 'right',
                display: notification.status === 'pending' ? 'flex' : 'inline',
              }}
            >
              {content}
              {notification.status === 'pending' && (
                <Loader type="ball-beat" active innerClassName={cls.loader} />
              )}
            </div>
          </div>
          {notification.status === 'pending' && isByMe && (
            <IconButton
              type="primary"
              icon={Close}
              className={cls.attentionButton}
              clear
              onSubmit={() => props.onCancelOffer(notification)}
            />
          )}
        </div>

        {notification.status === 'pending' && isToMe && (
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

const useStyles = createUseStyles<CustomTheme>(theme => ({
  container: {
    ...fonts.small1,
    marginBottom: spacers.large,
  },
  attention: {
    borderRight: `3px solid ${theme.colors.neutralDark}`,
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
      borderColor: theme.button.icon.borderColor
    }),
  },
  attentionButton: {
    height: '30px',
    width: '30px',
    ...makeImportant({
      marginBottom: 0,
      borderColor: theme.button.icon.borderColor
    }),
  },
  loader: {
    alignContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingLeft: spacers.smaller,
    ...({
      '& > div': {
        height: '7px',
        width: '7px',
        backgroundColor: theme.colors.primary,
      },
    } as CSSProperties),
  },
}));
