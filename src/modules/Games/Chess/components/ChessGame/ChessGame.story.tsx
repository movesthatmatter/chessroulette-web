/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { ChessGame } from './ChessGame';
import { otherChessColor } from '../../util';
import { ChessGameStateMocker } from 'src/mocks/records';
import { ChessGameColor, ChessGameState } from 'dstnd-io';
import { actions } from 'dstnd-io/dist/chessGame/chessGameStateReducer';
import { toISODateTime } from 'src/lib/date/ISODateTime';

const gameMocker = new ChessGameStateMocker();

export default {
  component: ChessGame,
  title: 'Modules/Games/Chess/components/Chess Game',
};

const getBoardSize = (dimensions: {
  screenWidth: number,
  screenHeight: number,
}) => Math.min(dimensions.screenWidth, dimensions.screenHeight) - 20

export const asWhite = () => (
  <ChessGame
    homeColor="white"
    playable
    game={gameMocker.record()}
    getBoardSize={getBoardSize}
  />
);
export const asBlack = () => (
  <ChessGame
    homeColor="black"
    playable
    game={gameMocker.record()}
    getBoardSize={getBoardSize}
  />
);
export const withLoggingOnMove = () => React.createElement(() => {
  const [game, setGame] = useState<ChessGameState>(gameMocker.pending());
  const myColor: ChessGameColor = 'white';

  return (
    <ChessGame
      homeColor="white"
      onMove={(move, newPgn) => {
        setGame((prev) => {
          if (
            prev.state === 'neverStarted'
            || prev.state === 'finished'
            || prev.state === 'stopped'
            || prev.state === 'waitingForOpponent'
          ) {
            return prev;
          }

          return actions.move(prev, {
            move,
            movedAt: toISODateTime(new Date()),
          });
        });

        action('onMove')(newPgn);
      }}
      game={game}
      playable={myColor !== game.lastMoveBy}
      getBoardSize={getBoardSize}
    />
  );
});

export const playableOnBothSide = () => React.createElement(() => {
  const [game, setGame] = useState(gameMocker.record());
  const [homeColor, setHomeColor] = useState<ChessGameColor>('white');

  return (
    <ChessGame
      homeColor={homeColor}
      orientation="white"
      onMove={(move, pgn) => {
        setGame((prev) => {
          if (
            prev.state === 'neverStarted'
            || prev.state === 'finished'
            || prev.state === 'stopped'
            || prev.state === 'waitingForOpponent'
          ) {
            return prev;
          }

          return actions.move(prev, {
            move,
            movedAt: toISODateTime(new Date()),
          });
        });

        setHomeColor((prev) => otherChessColor(prev));
        action('onMove')(pgn);
      }}
      game={game}
      playable={homeColor !== game.lastMoveBy}
      getBoardSize={getBoardSize}
    />
  );
});

export const withSwitchingSide = () => React.createElement(() => {
  const [game, setGame] = useState(gameMocker.record());
  const [homeColor, setHomeColor] = useState<ChessGameColor>('white');

  return (
    <ChessGame
      homeColor={homeColor}
      onMove={(move, pgn) => {
        setGame((prev) => {
          if (
            prev.state === 'neverStarted'
            || prev.state === 'finished'
            || prev.state === 'stopped'
            || prev.state === 'waitingForOpponent'
          ) {
            return prev;
          }

          return actions.move(prev, {
            move,
            movedAt: toISODateTime(new Date()),
          });
        });
        setHomeColor((prev) => otherChessColor(prev));
        action('onMove')(pgn);
      }}
      game={game}
      playable={homeColor !== game.lastMoveBy}
      getBoardSize={getBoardSize}
    />
  );
});

export const withStartedGame = () => (
  <ChessGame
    homeColor="black"
    playable
    game={gameMocker.started()}
  />
);

// const randomPlay = (
//   chess: ChessInstance,
//   onChange: (fen: string) => void = noop,
//   speed = 1000,
// ) => {
//   if (!chess.game_over()) {
//     const moves = chess.moves();
//     const move = moves[Math.floor(Math.random() * moves.length)];
//     chess.move(move);

//     onChange(chess.fen());

//     setTimeout(() => randomPlay(chess, onChange), speed);
//   }
// };

// export const demoRandomGame = () =>
//   React.createElement(() => {
//     const [game, setGame] = useState(gameMocker.record());

//     useEffect(() => {
//       const game = getNewChessGame();

//       randomPlay(
//         game,
//         () => {
//           // setGameState((prevState) => ({
//           //   ...prevState,
//           //   pgn: game.pgn(),
//           // }));
//         },
//         3 * 1000,
//       );
//     }, []);

//     return (
//       <ChessGame
//         homeColor="white"
//         pgn={gameState.pgn}
//         playable
//         getBoardSize={getBoardSize}
//       />
//     );
//   });
