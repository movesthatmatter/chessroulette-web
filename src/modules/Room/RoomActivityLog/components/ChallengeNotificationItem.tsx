import React from 'react';
import cx from 'classnames';
import capitalize from 'capitalize';
import Loader from 'react-loaders';
import { UserRecord } from 'dstnd-io';
import { IconButton } from 'src/components/Button';
import { createUseStyles, CSSProperties, makeImportant } from 'src/lib/jss';
import { colors, fonts } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { ChallengeNotification } from '../types';
import { Close } from 'grommet-icons';
import { PeerAvatar } from 'src/providers/PeerProvider/components/PeerAvatar';
import { getUserDisplayName } from 'src/modules/User';
import { chessGameTimeLimitMsMap } from 'dstnd-io/dist/metadata/game';
import { formatTimeLimit } from 'src/modules/GamesArchive/components/ArchivedGame/util';
import { renderMatch } from 'src/lib/renderMatch';
import { Text } from 'src/components/Text';
import { ClipboardCopyButton } from 'src/components/ClipboardCopy';
import { toChallengeUrlPath } from 'src/lib/util';

type Props = {
  notification: ChallengeNotification;
  className?: string;
  me: UserRecord;
  onCancel: (n: ChallengeNotification) => void;
};

export const ChallengeNotificationItem: React.FC<Props> = ({
  notification,
  me,
  className,
  ...props
}) => {
  const cls = useStyles();

  const needsAttention = notification.status === 'pending' && notification.byUser.id !== me.id;

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
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: notification.byUser.id === me.id ? 'row' : 'row-reverse',
            }}
          >
            <PeerAvatar
              peerUserInfo={notification.byUser}
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
              {renderMatch(
                () => null,
                [
                  notification.status === 'pending',
                  () => (
                    <div>
                      <div className={cls.title}>
                        <Text size="small2">
                          {notification.byUser.id === me.id ? (
                            'Your '
                          ) : (
                            <strong>{getUserDisplayName(notification.byUser)}'s </strong>
                          )}
                          Pending Challenge
                        </Text>
                        <Loader type="ball-beat" active innerClassName={cls.loader} />
                      </div>{' '}
                      A<strong>{' ' + capitalize(notification.gameSpecs.timeLimit) + ' '}</strong>(
                      {formatTimeLimit(chessGameTimeLimitMsMap[notification.gameSpecs.timeLimit])})
                      Game
                      <ClipboardCopyButton
                        label="Invite Friend"
                        copiedlLabel="Challenge Link Copied"
                        clear
                        value={`${window.location.origin}/${toChallengeUrlPath(
                          notification.challenge
                        )}`}
                        className={cx(cls.copyToClipboardBtn)}
                      />
                    </div>
                  ),
                ],
                [
                  notification.status === 'accepted',
                  () => (
                    <div>
                      {notification.byUser.id === me.id ? (
                        'Your'
                      ) : (
                        <strong>{getUserDisplayName(notification.byUser)}</strong>
                      )}{' '}
                      challenge for a
                      <strong>{' ' + capitalize(notification.gameSpecs.timeLimit) + ' '}</strong>(
                      {formatTimeLimit(chessGameTimeLimitMsMap[notification.gameSpecs.timeLimit])})
                      Game was accepted
                    </div>
                  ),
                ],
                [
                  notification.status === 'withdrawn',
                  () => (
                    <div>
                      {notification.byUser.id === me.id ? (
                        'Your'
                      ) : (
                        <strong>getUserDisplayName(notification.byUser)</strong>
                      )}{' '}
                      challenge for a
                      <strong>{' ' + capitalize(notification.gameSpecs.timeLimit) + ' '}</strong>(
                      {formatTimeLimit(chessGameTimeLimitMsMap[notification.gameSpecs.timeLimit])})
                      Game was sent into the void
                    </div>
                  ),
                ]
              )}
            </div>
          </div>
          {notification.status === 'pending' && notification.byUser.id === me.id && (
            <IconButton
              type="primary"
              icon={Close}
              className={cls.attentionButton}
              clear
              onSubmit={() => props.onCancel(notification)}
            />
          )}
        </div>
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
  challengeButton: {
    marginBottom: 0,
    marginTop: spacers.small,
  },
  title: {
    display: 'flex',
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
        backgroundColor: colors.primary,
      },
    } as CSSProperties),
  },
  copyToClipboardBtn: {
    marginBottom: 0,
    marginTop: spacers.small,
  },
});
