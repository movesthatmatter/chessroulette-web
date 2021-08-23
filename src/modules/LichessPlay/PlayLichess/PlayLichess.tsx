import React, { useEffect, useState } from 'react';
import { AuthenticatedPage, LichessAuthenticatedPage, Page } from 'src/components/Page';
import { Button } from 'src/components/Button';
import useInstance from '@use-it/instance';
import { ChessGameColor, ChessGameStateFen, ChessGameStatePgn, ChessMove } from 'dstnd-io';
import { LichessChallenge, LichessGameState } from '../types';
import { LichessGameStateDialogProvider } from './components/LichessGameStateDialogProvider';
import { useAuthenticatedUser } from 'src/services/Authentication';
import { Game } from 'src/modules/Games';
import { ChessGame } from 'src/modules/Games/Chess';
import { GameMocker } from 'src/mocks/records';
import { LichessGame } from 'src/modules/Games/Chess/components/LichessGame/LichessGame';
import { PlayProps } from 'src/modules/Rooms/PlayRoom/Layouts';
import { useLichessProvider } from '../LichessAPI/useLichessProvider';
import { updateGameWithNewStateFromLichess } from '../utils';
import { console } from 'window-or-global';
import { GameStateWidget } from 'src/modules/Games/Chess/components/GameStateWidget/GameStateWidget';
import { GameActions } from 'src/modules/Games/GameActions';

type Props = Pick<PlayProps, 'displayedPgn' | 'game' | 'meAsPlayer' | 'playable'>;

export const PlayLichess: React.FC<Props> = (props) => {
  const [game, setGame] = useState<Game | undefined>(undefined);
  const [newGameState, setNewGameState] = useState<LichessGameState | undefined>(undefined);
  const [challenge, setChallenge] = useState<LichessChallenge | undefined>(undefined);
  const [homeColor, setHomeColor] = useState<ChessGameColor>('white');
  const lichess = useLichessProvider();

  useEffect(() => {
    if (lichess) {
      lichess.onNewGame(({ game, homeColor }) => {
        setGame(game);
        setHomeColor(homeColor);
      });
      lichess.onGameUpdate(({ gameState }) => {
        setNewGameState(gameState);
      });
      lichess.onGameFinish(() => {
        console.log('GAME FINISHEDDDDD')
      })
    }
  }, []);

  useEffect(() => {
    if (newGameState && game) {
      setGame((prev) => {
        return updateGameWithNewStateFromLichess(prev as Game, newGameState);
      });
    }
  }, [newGameState]);

  // function startSubscriptions() {
  //  // lichessManager.startStream();
  //   // lichessManager.onUpdateChess(({ chess }) => setChess(chess));
  //   lichessManager.onGameFinished(({ game }) => setGame(game));
  //   lichessManager.onChallenge(({ challenge }) => setChallenge(challenge));
  // }

  const onMove = (p: { move: ChessMove; fen: ChessGameStateFen; pgn: ChessGameStatePgn }) => {
    if (game && lichess) {
      lichess.makeMove(p.move, game.id);
    }
  };

  return (
    <LichessAuthenticatedPage name="lichess" doNotTrack>
       {/* <LichessGameStateDialogProvider
        game={game}
        challenge={challenge}
        state={game.state}
      >  */}
      {game && (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <LichessGame
            // Reset the State each time the game id changes
            key={game.id}
            game={game}
            //displayedPgn={props.displayedPgn}
            homeColor={homeColor}
            size={512}
            playable
            onMove={onMove}
            //className={cls.board}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <GameStateWidget
              // This is needed for the countdown to reset the interval !!
              key={game.id}
              game={game}
              homeColor={homeColor}
              // historyFocusedIndex={props.historyIndex}
              // onHistoryFocusedIndexChanged={props.onHistoryIndexUpdated}
              // TODO: This should probably be seperate from the GameStateWidget
              //  something like a hook so it can be used without a view component
              //onTimerFinished={gameActions.onTimerFinished}
            />
          </div>
        </div>
      )}
      {/* </LichessGameStateDialogProvider> */}
    </LichessAuthenticatedPage>
  );
};
