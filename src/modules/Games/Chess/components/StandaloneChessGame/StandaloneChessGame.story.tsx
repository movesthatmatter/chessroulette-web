/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { PeerRecordMock, UserInfoMocker } from 'src/mocks/records';
import { Grommet } from 'grommet';
import { defaultTheme } from 'src/theme';
import { StandaloneChessGame } from './StandaloneChessGame';
import { ChessGameColor, ChessGameState } from '../../records';
import { otherChessColor } from '../../util';
import { reduceChessGame } from '../..';
import { GamePlayersBySide } from '../../chessGameStateReducer';

export default {
  component: StandaloneChessGame,
  title: 'Modules/Games/Chess/components/StandaloneChessGame',
};

const userInfoMocker = new UserInfoMocker();

const me = userInfoMocker.record();
const opponent = userInfoMocker.record();

const playersBySide: GamePlayersBySide = {
  home: userInfoMocker.withProps({ id: me.id }),
  away: userInfoMocker.withProps({ id: opponent.id }),
};

export const asWhite = () => React.createElement(() => {
  const [currentGame, setCurrentGame] = useState<ChessGameState>(reduceChessGame.prepareGame({
    playersBySide,
    homeColor: 'white',
    timeLimit: 'bullet',
  }));

  return (
    <Grommet theme={defaultTheme}>
      <StandaloneChessGame
        homeColor="white"
        playable={currentGame.state !== 'finished' && currentGame.state !== 'neverStarted'}
        game={currentGame}
        onMove={(nextPgn) => {
          if (
            !currentGame
            || currentGame.state === 'finished'
            || currentGame.state === 'neverStarted'
          ) {
            return;
          }

          setCurrentGame(reduceChessGame.move(currentGame, { pgn: nextPgn }));
          action('onMove')(nextPgn);
        }}
        onTimerFinished={() => {
          if (
            !currentGame
            || currentGame.state === 'finished'
            || currentGame.state === 'neverStarted'
          ) {
            return;
          }

          setCurrentGame(reduceChessGame.timerFinished(currentGame));
        }}
      />
    </Grommet>
  );
});

export const withSwitchingSide = () => React.createElement(() => {
  // const [fen, setFen] = useState<string>('');
  const [lastMoved, setLastMoved] = useState<ChessGameColor>('black');
  const [homeColor, setHomeColor] = useState<ChessGameColor>('white');

  const [currentGame, setCurrentGame] = useState<ChessGameState>(reduceChessGame.prepareGame({
    playersBySide,
    homeColor: 'white',
    timeLimit: 'bullet',
  }));

  return (
    <Grommet theme={defaultTheme}>
      <StandaloneChessGame
        homeColor={homeColor}
        onMove={(nextPgn) => {
          if (
            !currentGame
            || currentGame.state === 'finished'
            || currentGame.state === 'neverStarted'
          ) {
            return;
          }

          // setFen(newFen);
          setCurrentGame(reduceChessGame.move(currentGame, { pgn: nextPgn }));

          setLastMoved((prev) => otherChessColor(prev));
          setHomeColor((prev) => otherChessColor(prev));
          action('onMove')(nextPgn);
        }}
        onTimerFinished={() => {
          if (
            !currentGame
            || currentGame.state === 'finished'
            || currentGame.state === 'neverStarted'
          ) {
            return;
          }

          setCurrentGame(reduceChessGame.timerFinished(currentGame));
        }}
        game={currentGame}
        playable={homeColor !== lastMoved}
      />
    </Grommet>
  );
});

export const mated = () => React.createElement(() => {
  const [currentGame] = useState<ChessGameState>(reduceChessGame.prepareGame({
    playersBySide,
    homeColor: 'white',
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
