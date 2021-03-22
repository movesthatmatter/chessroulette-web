import capitalize from 'capitalize';
import { UserRecord } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { ClipboardCopy } from 'src/components/ClipboardCopy';
import { Page } from 'src/components/Page';
import { createUseStyles } from 'src/lib/jss';
import { useAuthenticatedUser } from 'src/services/Authentication';
import { colors } from 'src/theme';
import { getPlayer } from '../GameRoomV2/util';
import { ChessBoard } from '../Games/Chess/components/ChessBoardV2';
import { gameRecordToGame, pgnToFen } from '../Games/Chess/lib';
import { Game } from '../Games/types';
import { getUserGames } from './resources';

type Props = {};

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

export const GamesArchivePage: React.FC<Props> = (props) => {
  const cls = useStyles();
  const user = useAuthenticatedUser();
  const [games, setGames] = useState<Game[]>([]);


  useEffect(() => {
    if (!user) {
      return;
    }

    getUserGames({ userId: user.id }).map((gameRecords) => {
      setGames(gameRecords.map(gameRecordToGame))
    });
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <Page>
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
    </Page>
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