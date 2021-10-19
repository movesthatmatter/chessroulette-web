import React from 'react';
import cx from 'classnames';
import capitalize from 'capitalize';
import Loader from 'react-loaders';
import { UserRecord } from 'dstnd-io';
import { Button, IconButton } from 'src/components/Button';
import { createUseStyles, CSSProperties, makeImportant } from 'src/lib/jss';
import { CustomTheme, fonts } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { ChallengeNotification } from '../types';
import { Close } from 'grommet-icons';
import { PeerAvatar } from 'src/providers/PeerProvider/components/PeerAvatar';
import { getUserDisplayName } from 'src/modules/User';
import { chessGameTimeLimitMsMap } from 'dstnd-io/dist/metadata/game';
import { formatTimeLimit } from 'src/modules/GamesArchive/components/ArchivedGame/util';
import { renderMatch } from 'src/lib/renderMatch';
import { Text } from 'src/components/Text';
import { ClipboardCopyWidget } from 'src/components/ClipboardCopy';
import { toChallengeUrlPath } from 'src/lib/util';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
  notification: ChallengeNotification;
  className?: string;
  me: UserRecord;
  onCancel: (n: ChallengeNotification) => void;
  onAccept: (n: ChallengeNotification) => void;
};

export const ChallengeNotificationItem: React.FC<Props> = ({
  notification,
  me,
  className,
  ...props
}) => {
  const cls = useStyles();

  const isMyChallenge = notification.byUser.id === me.id;
  const needsAttention = notification.status === 'pending' && !isMyChallenge;

  return (
    <div className={cx(cls.container, needsAttention && cls.attention, className)}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex' }}>
            <PeerAvatar peerUserInfo={notification.byUser} className={cls.avatarRight} />
            <div>
              {renderMatch(
                () => null,
                [
                  notification.status === 'pending',
                  () => (
                    <div>
                      {isMyChallenge ? (
                        <div
                          className={cls.title}
                          style={{
                            display: 'flex',
                          }}
                        >
                          <Text size="small2">Your Challenge is pending</Text>
                          <Loader type="ball-beat" active innerClassName={cls.loader} />
                        </div>
                      ) : (
                        <div
                          className={cls.title}
                          style={
                            {
                              // textAlign: 'right',
                            }
                          }
                        >
                          <Text size="small2">
                            <strong>{getUserDisplayName(notification.byUser)}'s </strong>is
                            challenging you
                          </Text>
                        </div>
                      )}{' '}
                      A<strong>{' ' + capitalize(notification.gameSpecs.timeLimit) + ' '}</strong>(
                      {formatTimeLimit(chessGameTimeLimitMsMap[notification.gameSpecs.timeLimit])})
                      Game
                    </div>
                  ),
                ],
                [
                  notification.status === 'accepted',
                  () => (
                    <div>
                      {isMyChallenge ? (
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
                      {isMyChallenge ? (
                        'Your'
                      ) : (
                        <strong>{getUserDisplayName(notification.byUser)}</strong>
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
          {notification.status === 'pending' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}
            >
              {isMyChallenge ? (
                <>
                  <ClipboardCopyWidget
                    value={`${window.location.origin}/${toChallengeUrlPath(
                      notification.challenge
                    )}`}
                    render={({ copied, copy }) => (
                      <IconButton
                        type="positive"
                        iconType="fontAwesome"
                        icon={copied ? faCheck : faCopy}
                        className={cls.subtleButton}
                        clear
                        onSubmit={copy}
                        title="Invite Friend"
                        // tooltip={copied ? 'Copied' : undefined}
                      />
                    )}
                  />
                  <IconButton
                    type="primary"
                    iconType="grommet"
                    icon={Close}
                    className={cls.attentionButton}
                    clear
                    onSubmit={() => props.onCancel(notification)}
                    title="Cancel Challenge"
                  />
                </>
              ) : (
                <Button
                  type="primary"
                  label="Accept"
                  onClick={() => props.onAccept(notification)}
                  className={cls.challengeButton}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const useStyles = createUseStyles(theme => ({
  container: {
    ...fonts.small1,
    marginBottom: spacers.default,
  },
  attention: {
    borderLeft: `3px solid ${theme.colors.negativeLight}`,
    paddingLeft: spacers.small,
  },
  avatarLeft: {
    marginLeft: spacers.small,
  },
  avatarRight: {
    marginRight: spacers.small,
  },
  subtleButton: {
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
      borderColor: theme.button.icon.borderColor,
    }),
  },
  challengeButton: {
    marginBottom: 0,
  },
  title: {},
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
  copyToClipboardBtn: {
    marginBottom: 0,
    marginTop: spacers.small,
  },
}));
