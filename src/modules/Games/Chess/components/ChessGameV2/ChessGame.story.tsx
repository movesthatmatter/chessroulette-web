/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { ChessGameV2 } from './ChessGameV2';
import 'react-chessground/dist/styles/chessground.css';
import { GameMocker } from 'src/mocks/records/GameMocker';
import { Grommet } from 'grommet';
import { defaultTheme } from 'src/theme';
import { AwesomeLoader } from 'src/components/AwesomeLoader';

export default {
  component: ChessGameV2,
  title: 'Modules/Games/Chess/components/Chess Game V2',
};

const gameMocker = new GameMocker();

export const fromStartingPosition = () =>
  React.createElement(() => {
    // const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    const game = gameMocker.pending();

    return <ChessGameV2 id={game.id} pgn={game.pgn} homeColor="black" onMove={({ fen }) => {}} />;
  });

export const withGameStarted = () =>
  React.createElement(() => {
    // const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    const game = gameMocker.started();

    return (
      <ChessGameV2
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
        <ChessGameV2
          id={game.id}
          pgn={game.pgn}
          size={400}
          homeColor="black"
          onMove={({ fen }) => {}}
          notificationDialog={(p) => ({
            title: 'Waiting for opponent...',
            content: (
              <>
                {/* <div className={cls.contentText}>Waiting for your opponent...</div> */}
                <AwesomeLoader size={p.size ? p.size / 4 : 50} />
              </>
            ),
          })}
        />
      </Grommet>
    );
  });
