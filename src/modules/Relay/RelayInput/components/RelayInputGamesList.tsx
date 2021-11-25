import { RelayedGameRecord } from 'dstnd-io/dist/resourceCollections/relay/records';
import React from 'react';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { noop } from 'src/lib/util';
import { ChessBoard } from 'src/modules/Games/Chess/components/ChessBoard';
import { effects } from 'src/theme';
import { spacers } from 'src/theme/spacers';

type Props = {
  games: RelayedGameRecord[];
  onSelectRelay: (r: RelayedGameRecord) => void;
};

export const RelayInputGamesList: React.FC<Props> = ({ games, onSelectRelay }) => {
  const cls = useStyles();

  return (
    <div>
      <Text>Available Relays : </Text>
      {games.map((relayGame) => (
        <div
          className={cls.gameContainer}
          onClick={() => onSelectRelay(relayGame)}
        >
          <div className={cls.playerInfo}>{relayGame.game.players[0].user.name}</div>
          <ChessBoard
            type="free"
            playable={false}
            pgn={relayGame.game.pgn}
            viewOnly
            playableColor={'white'}
            onMove={noop}
            id={relayGame.game.id}
            size={200}
          />
          <div className={cls.playerInfo}>{relayGame.game.players[1].user.name}</div>
        </div>
      ))}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
  gameContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: spacers.small,
    ...effects.softBorderRadius,
    '&:hover': {
      // backgroundColor: them.colors.primary,
      cursor: 'pointer',
    },
  },
  playerInfo: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignContent: 'left',
    marginTop: '5px',
    marginBottom: '5px',
  },
});
