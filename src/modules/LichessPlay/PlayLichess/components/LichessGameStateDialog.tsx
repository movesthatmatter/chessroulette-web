import { Box } from 'grommet';
import React, { useEffect, useState } from 'react';
import { DialogContent } from 'src/components/Dialog';
import { Text } from 'src/components/Text';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { Game } from 'src/modules/Games';
import { getPlayerByColor } from 'src/modules/Games/Chess/lib';
import { colors, floatingShadow, onlyMobile, softBorderRadius } from 'src/theme';
import { LichessGameDialogContext } from './LichessGameStateDialogProvider';

type Props = NonNullable<LichessGameDialogContext>;

export const LichessGameStateDialog: React.FC<Props> = ({ game, status }) => {
  const [dialogSeen, setDialogSeen] = useState(false);

  const cls = useStyles();

  const content = ((game: Game | undefined) => {
    if (dialogSeen) {
      return null;
    }

    if (game && game.winner && game.winner !== '1/2') {
      return (
        <DialogContent
          title="Game Finished"
          content={
            <Box align="center">
              {status === 'mate' ? (
                <Text>
                  <strong>{getPlayerByColor(game.winner, game.players).user.name}</strong>
                  {` won by checkmate`}
                </Text>
              ) : status === 'outoftime' ? (
                <Text>
                  {`Time over for ${
                    getPlayerByColor(game.winner === 'black' ? 'white' : 'black', game.players).user
                      .name
                  }.`}
                  <strong>{`${getPlayerByColor(game.winner, game.players).user.name} `}</strong>
                  {`won!`}
                </Text>
              ) : status === 'resign' ? (
                <Text>
                  {`${
                    getPlayerByColor(game.winner === 'black' ? 'white' : 'black', game.players).user
                      .name
                  } resigned. `}
                  <strong>{getPlayerByColor(game.winner, game.players).user.name}</strong>
                  {` won!`}
                </Text>
              ) : (
                <Text>
                  <strong>{getPlayerByColor(game.winner, game.players).user.name}</strong>
                  {` won!`}
                </Text>
              )}
            </Box>
          }
          hasCloseButton={false}
          buttons={[
            {
              label: 'Ok',
              type: 'positive',
              onClick: () => {
                setDialogSeen(true);
              },
            },
          ]}
          onClose={() => setDialogSeen(true)}
        />
      );
    }
    if (game && game.winner && game.winner === '1/2') {
      return (
        <DialogContent
          title="Game Finished"
          content={
            <Box align="center">
              <Text> Game ended in a draw.</Text>
            </Box>
          }
          hasCloseButton={false}
          buttons={[
            {
              label: 'Ok',
              type: 'positive',
              onClick: () => {
                setDialogSeen(true);
              },
            },
            {
              label: 'Play Another Game',
              type: 'positive',
              onClick: () => {
                
              }
            }
          ]}
          onClose={() => setDialogSeen(true)}
        />
      );
    }
    return null;
  })(game);
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
