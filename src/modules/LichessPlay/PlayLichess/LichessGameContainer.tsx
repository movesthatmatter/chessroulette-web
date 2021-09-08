import React, { useEffect, useState } from 'react';
import {
  ChessGameColor,
  ChessGameStateFen,
  ChessGameStatePgn,
  ChessMove,
} from 'dstnd-io';
import { LichessGameState } from '../types';
import { LichessGameStateDialogProvider } from './components/LichessGameStateDialogProvider';
import { LichessGame } from 'src/modules/Games/Chess/components/LichessGame/LichessGame';
import { useLichessProvider } from '../LichessAPI/useLichessProvider';
import {
  updateGameWithNewStateFromLichess,
} from '../utils';
import { ChessGameHistoryProvider } from 'src/modules/Games/Chess/components/GameHistory';
import { floatingShadow, softBorderRadius } from 'src/theme';
import { useLichessGameActions } from '../useLichessGameActions/useLichessGameActions';
import { useLichessLogProvider } from './useLichessLogProvider/useLichessLogProvider';
import { LichessGameActions } from '../LichessGameActions/LichessGameActions';
import { createUseStyles } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import { Game } from 'src/modules/Games';
import { RoomLichessActivity } from 'src/modules/Room/RoomActivity/activities/PlayActivity';

type Props = {
  boardSize: number;
  game: Game;
  homeColor: ChessGameColor;
  activity: RoomLichessActivity
};

export const LichessGameContainer: React.FC<Props> = ({ boardSize, game, homeColor, activity }) => {
  const cls = useStyles();
  const [newGameState, setNewGameState] = useState<LichessGameState | undefined>(undefined);
  const lichess = useLichessProvider();
  const lichessGameActions = useLichessGameActions();

  useLichessLogProvider(homeColor);

  useEffect(() => {
   if (lichess){
    lichess.onGameUpdate(({ gameState }) => {
      setNewGameState(gameState);
    });
   }
  }, []);

  useEffect(() => {
    if (newGameState) {
      lichessGameActions.onUpdateGame(updateGameWithNewStateFromLichess(game, newGameState));
    }
  }, [newGameState]);

  const onMove = (p: { move: ChessMove; fen: ChessGameStateFen; pgn: ChessGameStatePgn }) => {
    if (game && lichess) {
      lichess.makeMove(p.move, game.vendorData?.gameId as string);
    }
  };

  return (
    <>
        <LichessGameStateDialogProvider game={game} status={newGameState?.status}>
          <ChessGameHistoryProvider history={game?.history || []}>
            <div className={cls.container}>
              <aside className={cls.side} style={{ height: boardSize }}>
                <div className={cls.sideTop} />
                <div style={{ height: '40%' }} />
                <LichessGameActions className={cls.sideBottom} game={game} activity={activity}/>
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
