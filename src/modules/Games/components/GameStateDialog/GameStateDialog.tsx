import capitalize from 'capitalize';
import { ChessPlayer } from 'dstnd-io';
import { Box } from 'grommet';
import React, { useEffect, useState } from 'react';
import { Dialog, DialogProps } from 'src/components/Dialog/Dialog';
import { Emoji } from 'src/components/Emoji';
import { useFeedbackDialog } from 'src/components/FeedbackDialog/useFeedbackDialog';
import { RoomWithPlayActivity } from 'src/providers/PeerProvider';
import { Text } from 'src/components/Text';
import { getPlayerByColor } from '../../Chess/lib';
import { useGameActions } from '../../GameActions';
import { useSelector } from 'react-redux';
import { selectCurrentRoomActivityLog } from 'src/modules/ActivityLog/redux/selectors';
import { getUserDisplayName } from 'src/modules/User';
import { Game } from '../../types';

type Props = {
  roomActivity: RoomWithPlayActivity['activity'];
  game: Game;
  myPlayer: ChessPlayer;
  target?: DialogProps['target'];
};

export const GameStateDialog: React.FC<Props> = ({ roomActivity, game, myPlayer, ...props }) => {
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

  if (!activityLog.pending) {
    if ((game.state === 'finished' || game.state === 'stopped') && !gameResultSeen) {
      return (
        <Dialog
          target={props.target}
          title="Game Ended"
          visible
          hasCloseButton={false}
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
                        {getUserDisplayName(getPlayerByColor(game.winner, game.players).user)}
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
            {
              label: 'Ok',
              type: 'secondary',
              onClick: () => setGameResultSeen(true),
            },
          ]}
        />
      );
    }

    return null;
  }

  // me as sender
  if (
    activityLog.pending?.status === 'pending' &&
    activityLog.pending.byUser.id === myPlayer.user.id
  ) {
    return (
      <Dialog
        target={props.target}
        title="Pending Offer"
        visible
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
      <Dialog
        target={props.target}
        visible
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
      <Dialog
        target={props.target}
        visible
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
      <Dialog
        target={props.target}
        visible
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
};
