import { Box } from 'grommet';
import React, { useEffect, useState } from 'react';
import { DialogContent } from 'src/components/Dialog';
import { Text } from 'src/components/Text';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { colors, floatingShadow, onlyMobile, softBorderRadius } from 'src/theme';
import { console } from 'window-or-global';
import { LichessChallenge, LichessGameFull } from '../../types';
import { LichessGameDialogContext } from './LichessGameStateDialogContext';

type Props = NonNullable<LichessGameDialogContext> & {
  onChallengeAccepted: (challenge: LichessChallenge) => void;
  onChallengeDeny: (challenge: LichessChallenge) => void;
};

export const LichessGameStateDialog: React.FC<Props> = ({
  game,
  challenge,
  state,
  onChallengeAccepted,
  onChallengeDeny,
}) => {
  const [dialogSeen, setDialogSeen] = useState(false);

  const cls = useStyles();

  const content = ((game: LichessGameFull | undefined, challenge: LichessChallenge | undefined) => {
    console.group('DIALOGGG');
    console.log('DIALOG GAME', game);
    console.log('DIALOG CHALLENGE', challenge);
    console.log('DIALOG STATE ', state);
    console.groupEnd();
    if (dialogSeen) {
      return null;
    }

    if (challenge && (state !== 'started')) {
      return (
        <DialogContent
          title="Rematch Offer"
          content="You have been challenged to a rematch"
          hasCloseButton={false}
          buttons={[
            {
              label: 'Accept',
              type: 'positive',
              onClick: () => onChallengeAccepted(challenge),
            },
            {
              label: 'Deny',
              type: 'negative',
              onClick: () => onChallengeDeny(challenge),
            },
          ]}
        />
      );
    }

    if (game && game.state.winner) {
      return (
        <DialogContent
          title="Game Finished"
          content={
            <Box align="center">
              <Text>
                <strong>{game[game.state.winner].name}</strong>
                {` won by ${game.state.status}`}
              </Text>
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
    return null;
  })(game, challenge);
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
