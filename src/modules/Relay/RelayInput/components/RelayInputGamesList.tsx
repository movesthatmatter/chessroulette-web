import { RelayedGameRecord } from 'dstnd-io/dist/resourceCollections/relay/records';
import React from 'react';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { noop } from 'src/lib/util';
import { ChessBoard } from 'src/modules/Games/Chess/components/ChessBoard';
import { getPlayerByColor } from 'src/modules/Games/Chess/lib';
import { getUserDisplayName } from 'src/modules/User';
import { CustomTheme, effects, fonts, softBorderRadius } from 'src/theme';
import { spacers } from 'src/theme/spacers';

type Props = {
  games: RelayedGameRecord[];
  onSelectRelay: (r: RelayedGameRecord) => void;
};

export const RelayInputGamesList: React.FC<Props> = ({ games, onSelectRelay }) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      <Text size="subtitle1">Available Relays : </Text>
      {games.map((relayGame) => (
        <div className={cls.gameContainer} onClick={() => onSelectRelay(relayGame)}>
          <div className={cls.playerInfo}>
            {getUserDisplayName(getPlayerByColor('black', relayGame.game.players).user)}
          </div>
          <ChessBoard
            coordinates={false}
            type="free"
            playable={false}
            pgn={relayGame.game.pgn}
            viewOnly
            playableColor={'white'}
            onMove={noop}
            id={relayGame.game.id}
            size={100}
          />
          <div className={cls.playerInfo}>
            {getUserDisplayName(getPlayerByColor('white', relayGame.game.players).user)}
          </div>
        </div>
      ))}
    </div>
  );
};

const useStyles = createUseStyles<CustomTheme>((theme) => ({
  container: {
    backgroundColor: theme.depthBackground.backgroundColor,
    padding: '5px',
    ...softBorderRadius,
  },
  gameContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: spacers.small,
    ...effects.softBorderRadius,
    '&:hover': {
      backgroundColor: theme.colors.secondaryLight,
      cursor: 'pointer',
    },
  },
  playerInfo: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignContent: 'left',
    marginTop: '5px',
    marginBottom: '5px',
    ...fonts.small1
  },
}));
