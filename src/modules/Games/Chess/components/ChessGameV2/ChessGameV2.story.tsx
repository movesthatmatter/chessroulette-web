/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react';
import { noop } from 'src/lib/util';
import { action } from '@storybook/addon-actions';
import { PeerRecordMock } from 'src/mocks/records';
import { Grommet } from 'grommet';
import { defaultTheme } from 'src/theme';
import { ChessGameV2 } from './ChessGameV2';
import { getNewChessGame, ChessInstance } from '../../lib/sdk';
import { ChessGameColor, ChessGameState } from '../../records';
import { otherChessColor } from '../../util';
import { reduceChessGame } from '../..';
import { GamePlayersBySide } from '../../chessGameStateReducer';

const randomPlay = (
  chess: ChessInstance,
  onChange: (fen: string) => void = noop,
  speed = 1000,
) => {
  if (!chess.game_over()) {
    const moves = chess.moves();
    const move = moves[Math.floor(Math.random() * moves.length)];
    chess.move(move);

    onChange(chess.fen());

    setTimeout(() => randomPlay(chess, onChange), speed);
  }
};

export default {
  component: ChessGameV2,
  title: 'Modules/Games/Chess/components/Chess Game V2',
};

const peerMock = new PeerRecordMock();

const me = peerMock.record();
const opponent = peerMock.record();

const playersBySide: GamePlayersBySide = {
  home: peerMock.withProps({ id: me.id }),
  away: peerMock.withProps({ id: opponent.id }),
};

export const asWhite = () => React.createElement(() => {
  const [currentGame, setCurrentGame] = useState<ChessGameState>(reduceChessGame.prepareGame({
    playersBySide,
    homeColor: 'white',
    timeLimit: 'blitz',
  }));

  return (
    <Grommet theme={defaultTheme}>
      <ChessGameV2
        homeColor="white"
        playable
        game={currentGame}
      />
    </Grommet>
  );
});
// export const asBlack = () => (
//   <ChessGameV2
//     homeColor="black"
//     playable
//     pgn=""
//   />
// );
// export const withLoggingOnMove = () => React.createElement(() => {
//   const [fen, setFen] = useState<string>('');
//   const [lastMoved, setLastMoved] = useState<ChessGameColor>('black');
//   const myColor: ChessGameColor = 'white';

//   return (
//     <ChessGameV2
//       homeColor="white"
//       onMove={(newFen) => {
//         setFen(newFen);
//         setLastMoved((prev) => otherChessColor(prev));
//         action('onMove')(newFen);
//       }}
//       pgn={fen}
//       playable={myColor !== lastMoved}
//       // fen={fen}
//     />
//   );
// });

// export const withSwitchingSide = () => React.createElement(() => {
//   const [fen, setFen] = useState<string>('');
//   const [lastMoved, setLastMoved] = useState<ChessGameColor>('black');
//   const [homeColor, setHomeColor] = useState<ChessGameColor>('white');

//   return (
//     <ChessGameV2
//       homeColor={homeColor}
//       onMove={(newFen) => {
//         setFen(newFen);
//         setLastMoved((prev) => otherChessColor(prev));
//         setHomeColor((prev) => otherChessColor(prev));
//         action('onMove')(newFen);
//       }}
//       pgn={fen}
//       playable={homeColor !== lastMoved}
//       // fen={fen}
//     />
//   );
// });

// export const withStartedGame = () => (
//   <ChessGame
//     homeColor="black"
//     playable
//     // fen="rnb1kbnr/ppp1pppp/3q4/3p4/4PP2/2N5/PPPP2PP/R1BQKBNR b KQkq - 2 3"
//     pgn=""
//   />
// );

// export const demoRandomGame = () =>
//   React.createElement(() => {
//     const [gameState, setGameState] = useState({ pgn: '' });

//     useEffect(() => {
//       const game = getNewChessGame();

//       randomPlay(
//         game,
//         () => {
//           setGameState((prevState) => ({
//             ...prevState,
//             pgn: game.pgn(),
//           }));
//         },
//         3 * 1000,
//       );
//     }, []);

//     return (
//       <ChessGame
//         homeColor="white"
//         pgn={gameState.pgn}
//         playable
//       />
//     );
//   });
