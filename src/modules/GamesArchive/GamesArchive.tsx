import capitalize from 'capitalize';
import { RegisteredUserRecord, UserRecord } from 'dstnd-io';
import React from 'react';
import { ClipboardCopy } from 'src/components/ClipboardCopy';
import { createUseStyles } from 'src/lib/jss';
import { colors } from 'src/theme';
import { getPlayer } from '../GameRoomV2/util';
import { ChessBoard } from '../Games/Chess/components/ChessBoardV2';
import { pgnToFen } from '../Games/Chess/lib';
import { Game } from '../Games/types';

type Props = {
  user: RegisteredUserRecord;
  games: Game[];
};

const getGameResult = (game: Game, userId: UserRecord['id']) => {
  if (game.winner === '1/2') {
    return 'Draw';
  }

  const winningColor = game.winner;

  const userPlayer = getPlayer(userId, game.players);

  if (!userPlayer) {
    return `${capitalize(winningColor || '')} Won`;
  }

  if (userPlayer.color === game.winner) {
    return 'Won';
  }

  return 'Lost';
}

export const GamesArchive: React.FC<Props> = ({
  user,
  games,
}) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      {games.map((game) => (
        <div className={cls.gameContainer} key={game.id}>
          <div>
            {game.createdAt}
          </div>
          <div>
            {`${game.players[0].user.firstName} ${game.players[0].user.lastName}`}
            {` - `}
            {`${game.players[1].user.firstName} ${game.players[1].user.lastName}`}
          </div>
          <div className={cls.gameResult}>
            {getGameResult(game, user.id)}
          </div>
          <div>
            <div>
              <ClipboardCopy
                value={game.pgn || ''}
              />
            </div>
          </div>
          <div>
            <ChessBoard fen={pgnToFen(game.pgn || '')} size={125} coordinates={false} />
          </div>
        </div>
      ))}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
  gameContainer: {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: `1px solid ${colors.neutralLight}`,
    padding: '16px',
    justifyContent: 'space-between',
  },
  gameResult: {},
});