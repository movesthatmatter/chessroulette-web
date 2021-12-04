import capitalize from 'capitalize';
import React, { useEffect, useState } from 'react';
import { DialogProps } from 'src/components/Dialog/Dialog';
import { Emoji } from 'src/components/Emoji';
import { Text } from 'src/components/Text';
import { getPlayerByColor } from '../../../Chess/lib';
import { useGameActions } from '../../../GameActions';
import { useSelector } from 'react-redux';
import { selectCurrentRoomActivityLog } from 'src/modules/Room/RoomActivityLog/redux/selectors';
import { getUserDisplayName } from 'src/modules/User';
import { DialogContent } from 'src/components/Dialog';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { CustomTheme, floatingShadow, onlyMobile, softBorderRadius } from 'src/theme';
import { otherChessColor } from 'dstnd-io/dist/chessGame/util/util';
import { DialogNotificationTypes } from '../type';
import { RoomPlayActivityWithGame } from 'src/modules/Room/RoomActivity/activities/PlayActivity';
import { useRoomConsumer } from 'src/modules/Room/RoomConsumers/useRoomConsumer';
import { useDeviceSize } from 'src/theme/hooks/useDeviceSize';
import { AwesomeLoader } from 'src/components/AwesomeLoader';

export type GameStateDialogContentProps = {
  activity: RoomPlayActivityWithGame;
  dialogNotificationTypes: DialogNotificationTypes;
  // target?: DialogProps['target'];
};

export const GameStateDialog: React.FC<GameStateDialogContentProps> = ({
  activity,
  dialogNotificationTypes,
}) => {
  const cls = useStyles();
  const { game } = activity;

  const [gameResultSeen, setGameResultSeen] = useState(false);
  const activityLog = useSelector(selectCurrentRoomActivityLog);
  const gameActions = useGameActions();
  const roomConsumer = useRoomConsumer();
  const deviceSize = useDeviceSize();

  // TODO: Make sure the game id matches the room activity game id
  useEffect(() => {
    // Everytime the game state changes, reset the seen!
    setGameResultSeen(false);
  }, [game.state]);

  // TODO: Take the Feedback out of here!
  // const feedbackDialog = useFeedbackDialog();
  // useEffect(() => {
  //   if (
  //     gameResultSeen &&
  //     (game.state === 'finished' || game.state === 'stopped') &&
  //     activity.iamParticipating &&
  //     game.winner === activity.participants.me.color
  //   ) {
  //     // Ask for Feedback only the first time (or next time if postponed) she wins!
  //     feedbackDialog.attemptToShow();
  //   }
  // }, [gameResultSeen, game.state, game.winner, activity]);

  const content = (() => {
    // TODO: This needs to be added back in some fashion!
    // if (isWaitingForOpponent(room, game)) {
    //   return (
    //     <DialogContent
    //       title="Waiting for opponent!"
    //       hasCloseButton={false}
    //       graphic={
    //         <div
    //           style={{
    //             textAlign: 'center',
    //             paddingBottom: '16px',
    //           }}
    //         >
    //           <Mutunachi
    //             mid={20}
    //             style={{
    //               width: '60%',
    //               display: 'inline',
    //             }}
    //           />
    //         </div>
    //       }
    //       content="But first let me take a nap..."
    //     />
    //   );
    // }

    if (!activityLog.pending) {
      if ((game.state === 'finished' || game.state === 'stopped') && !gameResultSeen) {
        return (
          <DialogContent
            title="Game Ended"
            content={
              <div
                style={{
                  textAlign: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {game.state === 'finished' && (
                  <Text>
                    {game.winner === '1/2' ? (
                      'Game Ended in a Draw by Stalemate!'
                    ) : (
                      <>
                        {`${capitalize(game.winner)} won! `}
                        <Text>
                          <Emoji symbol="🎉" />
                        </Text>
                      </>
                    )}
                  </Text>
                )}
                {game.state === 'stopped' && (
                  <Text>
                    {game.winner === '1/2' ? (
                      'Game Ended in a Draw!'
                    ) : (
                      <>
                        <strong>
                          {getUserDisplayName(
                            getPlayerByColor(otherChessColor(game.winner), game.players).user
                          )}
                        </strong>{' '}
                        has resigned.{' '}
                        <strong>
                          {getUserDisplayName(getPlayerByColor(game.winner, game.players).user)}
                        </strong>{' '}
                        won!
                      </>
                    )}
                  </Text>
                )}
              </div>
            }
            onClose={() => setGameResultSeen(true)}
            buttons={
              activity.iamParticipating
                ? [
                    deviceSize.isDesktop && {
                      label: 'Analyze',
                      type: 'primary',
                      onClick: () => {
                        setGameResultSeen(true);
                        if (roomConsumer) {
                          roomConsumer.roomActions.switchActivity({
                            activityType: 'analysis',
                            source: 'archivedGame',
                            gameId: game.id,
                          });
                        }
                      },
                    },
                    {
                      label: 'Rematch',
                      type: 'positive',
                      onClick: () => {
                        setGameResultSeen(true);
                        gameActions.onRematchOffer({});
                      },
                    },
                  ]
                : [
                    {
                      label: 'Ok',
                      type: 'secondary',
                      onClick: () => setGameResultSeen(true),
                    },
                  ]
            }
          />
        );
      }

      // TODO: Not sure this is needed
      if (game.state === 'neverStarted') {
        return (
          <DialogContent
            title="Game Aborted"
            hasCloseButton={false}
            content="The Previous Game was aborted!"
            buttons={[
              {
                label: 'Rematch',
                type: 'positive',
                onClick: () => {
                  setGameResultSeen(true);
                  gameActions.onRematchOffer({});
                },
              },
            ]}
          />
        );
      }
    }

    // Don't show the offers
    // if (!canShowOffers) {
    //   return null;
    // }
    if (dialogNotificationTypes === 'not-during-started-game' && game.state === 'started') {
      return null;
    }

    // If not participating in the activity don's show the offers
    if (!activity.iamParticipating) {
      return null;
    }

    // me as sender
    if (
      activityLog.pending?.status === 'pending' &&
      activityLog.pending.type === 'offer' &&
      activityLog.pending.byUser.id === activity.participants.me.userId
    ) {
      return (
        <DialogContent
          title="Pending Offer"
          hasCloseButton={false}
          content={
            <div>
              <AwesomeLoader minimal size="30%" />
              <div
                style={{
                  textAlign: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Text>
                  Waiting for <strong>{getUserDisplayName(activityLog.pending.toUser)}</strong>
                  {` `}
                  to make a decision...
                </Text>
              </div>
            </div>
          }
          onClose={() => () => gameActions.onOfferCanceled()}
          buttons={[
            {
              label: 'Cancel',
              type: 'negative',
              onClick: () => gameActions.onOfferCanceled(),
            },
          ]}
        />
      );
    }

    // me as receiver
    if (activityLog.pending?.type === 'offer' && activityLog.pending?.offerType === 'challenge') {
      return (
        <DialogContent
          title="Challenge Offer"
          hasCloseButton={false}
          content={
            <div>
              <AwesomeLoader minimal size="30%" />
              <div
                style={{
                  textAlign: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Text>
                  <strong>{getUserDisplayName(activityLog.pending.byUser)}</strong>
                  {` is challenging you to a New Game`}
                </Text>
              </div>
            </div>
          }
          buttons={[
            {
              label: 'Deny',
              type: 'negative',
              onClick: () => gameActions.onChallengeDenied(),
            },
            {
              label: 'Accept',
              type: 'positive',
              onClick: () => gameActions.onChallengeAccepted(),
            },
          ]}
        />
      );
    }

    if (activityLog.pending?.type === 'offer' && activityLog.pending?.offerType === 'rematch') {
      return (
        <DialogContent
          title="Rematch Offer"
          hasCloseButton={false}
          content={
            <div>
              <AwesomeLoader minimal size="30%" />
              <div
                style={{
                  textAlign: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Text>
                  <strong>{getUserDisplayName(activityLog.pending.byUser)}</strong>
                  {` is Offering a Rematch`}
                </Text>
              </div>
            </div>
          }
          buttons={[
            {
              label: 'Deny',
              type: 'negative',
              onClick: () => gameActions.onRematchDenied(),
            },
            {
              label: 'Accept',
              type: 'positive',
              onClick: () => gameActions.onRematchAccepted(),
            },
          ]}
        />
      );
    }

    if (activityLog.pending?.type === 'offer' && activityLog.pending?.offerType === 'draw') {
      return (
        <DialogContent
          title="Draw Offer"
          hasCloseButton={false}
          content={
            <div>
              <AwesomeLoader minimal size="30%" />
              <div
                style={{
                  textAlign: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Text>
                  <strong>{getUserDisplayName(activityLog.pending.byUser)}</strong>
                  {` is offering a Draw`}
                </Text>
              </div>
            </div>
          }
          buttons={[
            {
              label: 'Deny',
              type: 'negative',
              onClick: () => gameActions.onDrawDenied(),
            },
            {
              label: 'Accept',
              type: 'primary',
              onClick: () => gameActions.onDrawAccepted(),
            },
          ]}
        />
      );
    }

    return null;
  })();

  if (!content) {
    return null;
  }

  return (
    <div className={cls.container}>
      <div className={cls.dialog}>{content}</div>
    </div>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    background: `rgba(0, 0, 0, .3)`,
    zIndex: 9,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    ...(theme.name === 'lightDefault'
      ? {
          ...theme.floatingShadow,
        }
      : {
          boxShadow: '0 12px 26px rgb(0 0 0 / 35%)',
        }),
    ...softBorderRadius,
    padding: 0,
    position: 'relative',
    background: theme.colors.white,

    ...makeImportant({
      borderRadius: '8px',
      minWidth: '240px',
      maxWidth: '360px',
      width: '60%',
    }),

    ...onlyMobile({
      ...makeImportant({
        width: '84%',
        maxWidth: 'none',
      }),
    }),
  },
}));
