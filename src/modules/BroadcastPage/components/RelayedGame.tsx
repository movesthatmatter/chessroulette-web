import { RelayedGameInfoRecord } from 'dstnd-io';
import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { noop } from 'src/lib/util';
import { ChessBoard } from 'src/modules/Games/Chess/components/ChessBoard';
import { CustomTheme, effects } from 'src/theme';
import { spacers } from 'src/theme/spacers';

type Props = {
  relayGame: RelayedGameInfoRecord;
  showWizzard: () => void;
  selectRelayId : (relayId: string) => void
};

export const RelayedGame: React.FC<Props> = ({relayGame, showWizzard, selectRelayId}) => {
  const cls = useStyles();

  return (
    <div className={cls.gameContainer} onClick={() => {
      selectRelayId(relayGame.id);
      showWizzard();
  }}>
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
  );
};

const useStyles = createUseStyles<CustomTheme>(theme => ({
  container: {},
  gameContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: spacers.small,
    ...effects.softBorderRadius,
    '&:hover' : {
      backgroundColor: theme.colors.primary,
      cursor: 'pointer'
    }
  },
  playerInfo: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignContent: 'left',
    marginTop: '5px',
    marginBottom: '5px',
  },
}));