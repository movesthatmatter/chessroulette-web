/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { ChessBoard } from './ChessBoard';
//import 'src/modules/Games/Chess/components/ChessBoard/node_modules/react-chessground/dist/styles/chessground.css';
import { GameMocker } from 'src/mocks/records/GameMocker';
import { Grommet } from 'grommet';
import { defaultTheme } from 'src/theme';
import { AwesomeLoader } from 'src/components/AwesomeLoader';
import { chessGameActions, ChessGameColor } from 'dstnd-io';
import { toISODateTime } from 'io-ts-isodatetime';
import { Game } from 'src/modules/Games/types';
import { action } from '@storybook/addon-actions';
import { DialogContent } from 'src/components/Dialog';

export default {
  component: ChessBoard,
  title: 'modules/Games/Chess/components/ChessBoard',
};

const gameMocker = new GameMocker();

export const fromStartingPosition = () =>
  React.createElement(() => {
    // const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    const game = gameMocker.pending();

    return (
      <ChessBoard
        type="play"
        id={game.id}
        pgn={game.pgn}
        homeColor="black"
        onMove={({ fen }) => {}}
        size={400}
      />
    );
  });

export const playable = () =>
  React.createElement(() => {
    const [game, setGame] = useState<Game>(gameMocker.pending());
    const [turn, setTurn] = useState<ChessGameColor>('white');

    return (
      <ChessBoard
        type="play"
        id={game.id}
        pgn={game.pgn}
        size={600}
        homeColor={turn}
        playable
        onMove={(m) => {
          if (game.state === 'pending' || game.state === 'started') {
            setGame((prev) => ({
              ...prev,
              ...chessGameActions.move(game, { move: m.move, movedAt: toISODateTime(new Date()) }),
            }));
            setTurn((prev) => (prev === 'white' ? 'black' : 'white'));

            action('on move')(m);
          }
        }}
      />
    );
  });

export const withGameStarted = () =>
  React.createElement(() => {
    // const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    const game = gameMocker.started();

    return (
      <ChessBoard
        type="play"
        id={game.id}
        pgn={game.pgn}
        size={400}
        homeColor="black"
        onMove={({ fen }) => {}}
      />
    );
  });

export const withNotification = () =>
  React.createElement(() => {
    // const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    const game = gameMocker.started();

    return (
      <Grommet theme={defaultTheme}>
        <ChessBoard
          type="play"
          id={game.id}
          pgn={game.pgn}
          size={400}
          homeColor="black"
          onMove={({ fen }) => {}}
          overlayComponent={(p) => (
            <DialogContent
              {...{
                title: 'Waiting for opponent...',
                content: (
                  <>
                    {/* <div className={cls.contentText}>Waiting for your opponent...</div> */}
                    <AwesomeLoader size={p.size ? p.size / 4 : 50} />
                  </>
                ),
              }}
            />
          )}
        />
      </Grommet>
    );
  });
