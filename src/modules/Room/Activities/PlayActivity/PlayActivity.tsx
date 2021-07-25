import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { floatingShadow, softBorderRadius } from 'src/theme';
import { ChessGame } from 'src/modules/Games/Chess';
import { Game } from 'src/modules/Games';
import { useMyPeerPlayerStats } from './hooks/useMyPeerPlayerStats';

type Props = {
  game: Game;
  size: number;
  displayedPgn?: Game['pgn'];
};

export const PlayActivity: React.FC<Props> = ({ game, ...props }) => {
  const cls = useStyles();
  const myPeerPlayerStats = useMyPeerPlayerStats(game);

  return (
    <ChessGame
      // Reset the State each time the game id changes
      key={game.id}
      game={game}
      size={props.size}
      // Default to white
      homeColor={myPeerPlayerStats.isPlayer ? myPeerPlayerStats.player.color : 'white'}
      playable={myPeerPlayerStats.canPlay}
      displayedPgn={props.displayedPgn}
      className={cls.board}
    />
  );
};

const useStyles = createUseStyles({
  board: {
    ...floatingShadow,
    ...softBorderRadius,
    overflow: 'hidden',
  },
});
