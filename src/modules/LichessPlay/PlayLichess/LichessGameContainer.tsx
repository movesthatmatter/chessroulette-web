import React, { useEffect, useState } from 'react';
import {
  ChessGameColor,
  ChessGameStateFen,
  ChessGameStatePgn,
  ChessMove,
  GuestUserRecord,
} from 'dstnd-io';
import { LichessGameState } from '../types';
import { LichessGameStateDialogProvider } from './components/LichessGameStateDialogProvider';
import { LichessGame } from 'src/modules/Games/Chess/components/LichessGame/LichessGame';
import { useLichessProvider } from '../LichessAPI/useLichessProvider';
import {
  getAwayPlayer,
  updateGameWithNewStateFromLichess,
} from '../utils';
import { console } from 'window-or-global';
import { ChessGameHistoryProvider } from 'src/modules/Games/Chess/components/GameHistory';
import { ChessBoard } from 'src/modules/Games/Chess/components/ChessBoard';
import { floatingShadow, softBorderRadius } from 'src/theme';
import { useLichessGameActions } from '../useLichessGameActions/useLichessGameActions';
import { useSelector } from 'react-redux';
import { selectGame } from 'src/modules/Room/RoomActivity/redux/selectors';
import { useLichessLogProvider } from './useLichessLogProvider/useLichessLogProvider';
import { authenticateAsExistentGuest } from 'src/services/Authentication/resources';
import { LichessGameActions } from '../LichessGameActions/LichessGameActions';
import { createUseStyles } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';

type Props = {
  boardSize: number;
};

export const LichessGameContainer: React.FC<Props> = ({ boardSize }) => {
  const cls = useStyles();
  const game = useSelector(selectGame);
  const [newGameState, setNewGameState] = useState<LichessGameState | undefined>(undefined);
  const [homeColor, setHomeColor] = useState<ChessGameColor>('white');
  const lichess = useLichessProvider();
  const gameActions = useLichessGameActions();

  useLichessLogProvider(homeColor);

  useEffect(() => {
    if (lichess) {
      lichess.onNewGame(({ game, homeColor, player }) => {
        setHomeColor(homeColor);
        gameActions.onJoinedGame(game, player);
        authenticateAsExistentGuest({
          guestUser: getAwayPlayer(homeColor, game).user as GuestUserRecord,
        });
      });
      lichess.onGameUpdate(({ gameState }) => {
        setNewGameState(gameState);
      });
      lichess.onGameFinish(() => {
        console.log('Game Finished');
      });
     
    }
  }, []);

  useEffect(() => {
    if (newGameState && game) {
      gameActions.onUpdateGame(updateGameWithNewStateFromLichess(game, newGameState));
    }
  }, [newGameState]);

  const onMove = (p: { move: ChessMove; fen: ChessGameStateFen; pgn: ChessGameStatePgn }) => {
    if (game && lichess) {
      lichess.makeMove(p.move, game.vendorData?.gameId as string);
    }
  };

  return (
    <>
      {game ? (
        <LichessGameStateDialogProvider game={game} status={newGameState?.status}>
          <ChessGameHistoryProvider history={game?.history || []}>
            <div className={cls.container}>
              <aside className={cls.side} style={{ height: boardSize }}>
                <div className={cls.sideTop} />
                <div style={{ height: '40%' }} />
                <LichessGameActions className={cls.sideBottom} />
              </aside>
              <LichessGame
                type="play"
                // Reset the State each time the game id changes
                key={game.id}
                game={game}
                homeColor={homeColor}
                size={boardSize}
                playable
                onMove={onMove}
              />
            </div>
          </ChessGameHistoryProvider>
        </LichessGameStateDialogProvider>
      ) : (
        <ChessBoard
          type="free"
          size={boardSize}
          id="empty-frozen-board"
          pgn=""
          homeColor="white"
          onMove={() => {}}
          style={{
            ...floatingShadow,
            ...softBorderRadius,
            overflow: 'hidden',
          }}
        />
      )}
    </>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
  },
  board: {
    ...floatingShadow,
    ...softBorderRadius,
    overflow: 'hidden',
  },
  side: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    marginRight: spacers.large,
  },
  sideTop: {
    height: '30%',
  },
  sideBottom: {
    height: '30%',
  },
});
