/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { UserInfoMocker } from 'src/mocks/records';
import { Grommet } from 'grommet';
import { defaultTheme } from 'src/theme';
import {
  chessGameActions, ChessGameState, ChessGameColor, UserInfoRecord, ChessGameStateStarted,
} from 'dstnd-io';
import { StandaloneChessGame } from './StandaloneChessGame';
// import { ChessGameColor, ChessGameState } from '../../records';
import { otherChessColor } from '../../util';
// import { GamePlayersBySide } from '../../chessGameStateReducer';

export default {
  component: StandaloneChessGame,
  title: 'Modules/Games/Chess/components/StandaloneChessGame',
};

const userInfoMocker = new UserInfoMocker();

const me = userInfoMocker.record();
const opponent = userInfoMocker.record();

// const playersBySide: GamePlayersBySide = {
//   home: userInfoMocker.withProps({ id: me.id }),
//   away: userInfoMocker.withProps({ id: opponent.id }),
// };

const players = [
  userInfoMocker.withProps({ id: me.id }),
  userInfoMocker.withProps({ id: opponent.id }),
] as [UserInfoRecord, UserInfoRecord];

export const asWhite = () => React.createElement(() => {
  const [currentGame, setCurrentGame] = useState<ChessGameState>(chessGameActions.prepareGame({
    players,
    preferredColor: 'white',
    timeLimit: 'bullet',
  }));

  return (
    <Grommet theme={defaultTheme}>
      <StandaloneChessGame
        homeColor="white"
        playable={currentGame.state !== 'finished' && currentGame.state !== 'neverStarted'}
        game={currentGame}
        onMove={(move) => {
          if (
            !currentGame
            || currentGame.state === 'finished'
            || currentGame.state === 'neverStarted'
          ) {
            return;
          }

          setCurrentGame(chessGameActions.move(currentGame as ChessGameStateStarted, { move }));
          action('onMove')(move);
        }}
        onTimerFinished={() => {
          if (
            !currentGame
            || currentGame.state === 'finished'
            || currentGame.state === 'neverStarted'
          ) {
            return;
          }

          setCurrentGame(chessGameActions.timerFinished(currentGame as ChessGameStateStarted));
        }}
      />
    </Grommet>
  );
});

export const withSwitchingSide = () => React.createElement(() => {
  // const [fen, setFen] = useState<string>('');
  const [lastMoved, setLastMoved] = useState<ChessGameColor>('black');
  const [homeColor, setHomeColor] = useState<ChessGameColor>('white');

  const [currentGame, setCurrentGame] = useState<ChessGameState>(chessGameActions.prepareGame({
    players,
    preferredColor: 'white',
    timeLimit: 'bullet',
  }));

  return (
    <Grommet theme={defaultTheme}>
      <StandaloneChessGame
        homeColor={homeColor}
        onMove={(move) => {
          if (
            !currentGame
            || currentGame.state === 'finished'
            || currentGame.state === 'neverStarted'
          ) {
            return;
          }

          // setFen(newFen);
          setCurrentGame(chessGameActions.move(currentGame as ChessGameStateStarted, { move }));

          setLastMoved((prev) => otherChessColor(prev));
          setHomeColor((prev) => otherChessColor(prev));
          action('onMove')(move);
        }}
        onTimerFinished={() => {
          if (
            !currentGame
            || currentGame.state === 'finished'
            || currentGame.state === 'neverStarted'
          ) {
            return;
          }

          setCurrentGame(chessGameActions.timerFinished(currentGame as ChessGameStateStarted));
        }}
        game={currentGame}
        playable={homeColor !== lastMoved}
      />
    </Grommet>
  );
});

export const mated = () => React.createElement(() => {
  const [currentGame] = useState<ChessGameState>(chessGameActions.prepareGame({
    players,
    preferredColor: 'white',
    timeLimit: 'rapid',
    pgn: '1. e4 e5 2. Qf3 Na6 3. Bc4 h6 4. Qxf7#',
  }));

  return (
    <Grommet theme={defaultTheme}>
      <StandaloneChessGame
        homeColor="white"
        playable
        game={currentGame}
        onMove={action('on move')}
        onTimerFinished={action('on timer finished')}
      />
    </Grommet>
  );
});
