import capitalize from 'capitalize';
import { ChessPlayer } from 'dstnd-io';
import { Box } from 'grommet';
import React, { useEffect, useState } from 'react';
import { DialogProps } from 'src/components/Dialog/Dialog';
import { Emoji } from 'src/components/Emoji';
import { useFeedbackDialog } from 'src/components/FeedbackDialog/useFeedbackDialog';
import { RoomWithPlayActivity } from 'src/providers/PeerProvider';
import { Text } from 'src/components/Text';
import { getPlayerByColor } from '../../../Chess/lib';
import { useGameActions } from '../../../GameActions';
import { useSelector } from 'react-redux';
import { selectCurrentRoomActivityLog } from 'src/modules/ActivityLog/redux/selectors';
import { getUserDisplayName } from 'src/modules/User';
import { Game } from '../../../types';
import { DialogContent } from 'src/components/Dialog';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { colors, floatingShadow, onlyMobile, softBorderRadius } from 'src/theme';
import { otherChessColor } from 'dstnd-io/dist/chessGame/util/util';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';

export type GameStateDialogContentProps = {
  isMobile: boolean;
  room: RoomWithPlayActivity;
  game: Game;
  myPlayer: ChessPlayer;
  target?: DialogProps['target'];
};

const areBothPlayersJoined = ({ peersIncludingMe }: RoomWithPlayActivity, game: Game) => {
  const [playerA, playerB] = game.players;

  return playerA.user.id in peersIncludingMe && playerB.user.id in peersIncludingMe;
};

const isWaitingForOpponent = (room: RoomWithPlayActivity, game: Game) => {
  const bothPlayersJoined = areBothPlayersJoined(room, game);

  return !bothPlayersJoined && game.state === 'pending';
};

export const GameStateDialog: React.FC<GameStateDialogContentProps> = ({
  room,
  game,
  myPlayer,
  isMobile,
}) => {
  const cls = useStyles();

  const [gameResultSeen, setGameResultSeen] = useState(false);
  const feedbackDialog = useFeedbackDialog();
  const activityLog = useSelector(selectCurrentRoomActivityLog);
  const gameActions = useGameActions();

  // TODO: Make sure the game id matches the room activity game id
  useEffect(() => {
    // Everytime the game state changes, reset the seen!
    setGameResultSeen(false);
  }, [game.state]);

  // TODO: Take this out of here!
  useEffect(() => {
    if (
      gameResultSeen &&
      (game.state === 'finished' || game.state === 'stopped') &&
      game.winner === myPlayer?.color
    ) {
      // Ask for Feedback only the first time (or next time if postponed) she wins!
      feedbackDialog.attemptToShow();
    }
  }, [gameResultSeen, game.state, game.winner, myPlayer]);

  const content = (() => {
    // TODO: Not sure this should be showing even if there is a pending offer
    if (!activityLog.pending) {
      if ((game.state === 'finished' || game.state === 'stopped') && !gameResultSeen) {
        return (
          <DialogContent
            title="Game Ended"
            content={
              <Box align="center">
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
                        resigned!
                      </>
                    )}
                  </Text>
                )}
              </Box>
            }
            onClose={() => setGameResultSeen(true)}
            buttons={[
              // {
              //   label: 'Ok',
              //   type: 'secondary',
              //   onClick: () => setGameResultSeen(true),
              // },
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

    if (isWaitingForOpponent(room, game)) {
      return (
        <DialogContent
          title="Waiting for your opponent!"
          hasCloseButton={false}
          graphic={
            <div
              style={{
                textAlign: 'center',
                paddingBottom: '16px',
              }}
            >
              <Mutunachi
                mid={20}
                style={
                  {
                    width: '60%',
                    display: 'inline',
                  }
                }
              />
            </div>
          }
          content="But first let me take a nap..."
        />
      );
    }

    // Don't show the rest on desktop
    if (!isMobile) {
      return null;
    }

    // me as sender
    if (
      activityLog.pending?.status === 'pending' &&
      activityLog.pending.byUser.id === myPlayer.user.id
    ) {
      return (
        <DialogContent
          title="Pending Offer"
          hasCloseButton={false}
          content={
            <Box align="center">
              <Text>
                Waiting for <strong>{getUserDisplayName(activityLog.pending.toUser)}</strong>
                {` `}
                to make a decision...
              </Text>
            </Box>
          }
          onClose={() => () => gameActions.onOfferCanceled()}
          buttons={[
            {
              label: 'Cancel',
              type: 'secondary',
              onClick: () => gameActions.onOfferCanceled(),
            },
          ]}
        />
      );
    }

    // me as receiver
    // me as watcher
    if (activityLog.pending?.offerType === 'challenge') {
      return (
        <DialogContent
          title="Challenge Offer"
          hasCloseButton={false}
          content={
            <Box align="center">
              <Text>
                <strong>{getUserDisplayName(activityLog.pending.byUser)}</strong>
                {` is challenging you to a New Game`}
              </Text>
            </Box>
          }
          buttons={
            myPlayer && [
              {
                label: 'Deny',
                type: 'secondary',
                onClick: () => gameActions.onChallengeDenied(),
              },
              {
                label: 'Accept',
                type: 'primary',
                onClick: () => gameActions.onChallengeAccepted(),
              },
            ]
          }
        />
      );
    }

    if (activityLog.pending?.offerType === 'rematch') {
      return (
        <DialogContent
          title="Rematch Offer"
          hasCloseButton={false}
          content={
            <Box align="center">
              <Text>
                <strong>{getUserDisplayName(activityLog.pending.byUser)}</strong>
                {` is Offering a Rematch`}
              </Text>
            </Box>
          }
          buttons={
            myPlayer && [
              {
                label: 'Deny',
                type: 'secondary',
                onClick: () => gameActions.onRematchDenied(),
              },
              {
                label: 'Accept',
                type: 'primary',
                onClick: () => gameActions.onRematchAccepted(),
              },
            ]
          }
        />
      );
    }

    if (activityLog.pending?.offerType === 'draw') {
      return (
        <DialogContent
          title="Draw Offer"
          hasCloseButton={false}
          content={
            <Box align="center">
              <Text>
                <strong>{getUserDisplayName(activityLog.pending.byUser)}</strong>
                {` is offering a Draw`}
              </Text>
            </Box>
          }
          buttons={
            myPlayer && [
              {
                label: 'Deny',
                type: 'secondary',
                onClick: () => gameActions.onDrawDenied(),
              },
              {
                label: 'Accept',
                type: 'primary',
                onClick: () => gameActions.onDrawAccepted(),
              },
            ]
          }
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

const useStyles = createUseStyles({
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
    ...floatingShadow,
    ...softBorderRadius,
    padding: 0,
    position: 'relative',
    background: colors.white,

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
});
