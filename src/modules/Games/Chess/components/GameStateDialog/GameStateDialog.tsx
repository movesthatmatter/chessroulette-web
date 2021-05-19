import capitalize from 'capitalize';
import { ChessPlayer, GameRecord } from 'dstnd-io';
import { Box } from 'grommet';
import React, { useEffect, useState } from 'react';
import { Dialog, DialogProps } from 'src/components/Dialog/Dialog';
import { Emoji } from 'src/components/Emoji';
import { useFeedbackDialog } from 'src/components/FeedbackDialog/useFeedbackDialog';
import { RoomWithPlayActivity } from 'src/providers/PeerProvider';
import { Text } from 'src/components/Text';
import { otherChessColor } from 'src/modules/Games/Chess/util';
import { getPlayerByColor } from '../../../../GameRoomV2/util';

type Props = {
  roomActivity: RoomWithPlayActivity['activity'];
  game: GameRecord;
  myPlayer?: ChessPlayer;

  onOfferCanceled: () => void;
  onRematchDenied: () => void;
  onRematchAccepted: () => void;

  onDrawDenied: () => void;
  onDrawAccepted: () => void;

  target?: DialogProps['target'];
};

export const GameStateDialog: React.FC<Props> = ({ roomActivity, game, myPlayer, ...props }) => {
  const [gameResultSeen, setGameResultSeen] = useState(false);
  const feedbackDialog = useFeedbackDialog();

  // TODO: Make sure the game id matches the room activity game id

  useEffect(() => {
    // Everytime the game state changes, reset the seen!
    setGameResultSeen(false);
  }, [game.state]);

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


  if (!roomActivity.offer) {
    if ((game.state === 'finished' || game.state === 'stopped') && !gameResultSeen) {
      return (
        <Dialog
          target={props.target}
          visible
          hasCloseButton={false}
          content={
            <Box align="center">
              {/* <Text>Waiting for your opponent to make a decision...</Text> */}
              {game.state === 'finished' && (
                <>
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
                </>
              )}
              {game.state === 'stopped' && (
                <>
                  {game.winner === '1/2'
                    ? 'Game Ended in a Draw!'
                    : `${capitalize(otherChessColor(game.winner))} resigned!`}
                </>
              )}
            </Box>
          }
          onClose={() => () => setGameResultSeen(true)}
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
  if (myPlayer && roomActivity.offer.content.byUser.id === myPlayer.user.id) {
    return (
      <Dialog
        target={props.target}
        visible
        hasCloseButton={false}
        content={
          <Box align="center">
            <Text>Waiting for your opponent to make a decision...</Text>
          </Box>
        }
        onClose={() => () => props.onOfferCanceled()}
        buttons={[
          {
            label: 'Cancel',
            type: 'secondary',
            onClick: () => props.onOfferCanceled(),
          },
        ]}
      />
    );
  }

  // me as receiver
  // me as watcher
  if (roomActivity.offer.type === 'rematch') {
    return (
      <Dialog
        target={props.target}
        visible
        hasCloseButton={false}
        content={
          <Box align="center">
            {(() => {
              const offerer = getPlayerByColor(
                roomActivity.offer.content.by,
                game.players
              );

              return (
                <Text>
                  <strong>
                    {offerer ? offerer.user.name : capitalize(roomActivity.offer.content.by)}
                  </strong>
                  {` wants a rematch`}
                </Text>
              );
            })()}
          </Box>
        }
        buttons={
          myPlayer && [
            {
              label: 'Deny',
              type: 'secondary',
              onClick: () => props.onRematchDenied(),
            },
            {
              label: 'Accept',
              type: 'primary',
              onClick: () => props.onRematchAccepted(),
            },
          ]
        }
      />
    );
  }

  if (roomActivity.offer.type === 'draw') {
    return (
      <Dialog
        target={props.target}
        visible
        hasCloseButton={false}
        content={
          <Box align="center">
            {(() => {
              const offerer = getPlayerByColor(
                roomActivity.offer.content.by,
                game.players
              );

              return (
                <Text>
                  <strong>
                    {offerer ? offerer.user.name : capitalize(roomActivity.offer.content.by)}
                  </strong>
                  {` is offering a Draw`}
                </Text>
              );
            })()}
          </Box>
        }
        buttons={
          myPlayer && [
            {
              label: 'Deny',
              type: 'secondary',
              onClick: () => props.onDrawDenied(),
            },
            {
              label: 'Accept',
              type: 'primary',
              onClick: () => props.onDrawAccepted(),
            },
          ]
        }
      />
    );
  }

  return null;
};
