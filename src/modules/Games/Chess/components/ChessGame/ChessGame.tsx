import React, { useEffect, useState } from 'react';
import { noop } from 'src/lib/util';
import { createUseStyles } from 'src/lib/jss';
import { ChessBoard } from '../ChessBoard';
import { getNewChessGame } from '../../lib/sdk';
import { ChessPlayers } from '../../records';

type Props = {
  players: ChessPlayers;
  playable?: boolean;
  allowSinglePlayerPlay?: boolean;
  onMove?: (fen: string) => void;
  fen?: string;

  // The bottom side
  homeColor: 'white' | 'black';
};

type GameState = {
  fen: string;
};

const timerStart = new Date();
const calcutateTimerDisplay = (): {minutes: number; seconds: number} => {
  const dif = +new Date() - +timerStart;
  const display = {
    minutes: Math.floor((dif / 1000 / 60) % 60),
    seconds: Math.floor((dif / 1000) % 60),
  };
  return display;
};

export const ChessGame: React.FunctionComponent<Props> = ({
  onMove = noop,
  fen = getNewChessGame().fen(),
  allowSinglePlayerPlay = false,
  playable = true,
  ...props
}) => {
  const cls = useStyles();
  const [timer, setTimer] = useState<{minutes: number; seconds: number}>(calcutateTimerDisplay());
  const awayColor = props.homeColor === 'white' ? 'black' : 'white';

  useEffect(() => {
    const timerInterval = setInterval(() => setTimer(calcutateTimerDisplay()), 1000);
    return () => clearInterval(timerInterval);
  }, []);

  return (
    <div className={cls.container}>
      <div className={cls.topScoreInfo}>
        <div>{timer.minutes < 10 ? `0${timer.minutes}` : timer.minutes}</div>
        <div>:</div>
        <div>{timer.seconds < 10 ? `0${timer.seconds}` : timer.seconds}</div>
      </div>
      <ChessBoard
        orientation={props.homeColor}
        position={fen}
        calcWidth={({
          screenWidth,
          screenHeight,
        }: {
          screenWidth: number;
          screenHeight: number;
        }) => (screenWidth * 0.35)}
        darkSquareStyle={{
          backgroundColor: '#6792B4',
        }}
        lightSquareStyle={{
          backgroundColor: '#D7D7D7',
        }}
        allowDrag={(p) => {
          if (!playable) {
            return false;
          }
          return allowSinglePlayerPlay || p.piece.slice(0, 1) === props.homeColor.slice(0, 1);
        }}
        onDrop={({ sourceSquare, targetSquare }) => {
          const game = getNewChessGame(fen);

          // see if the move is legal
          const validMove = game.move({
            from: sourceSquare,
            to: targetSquare,
          });

          if (validMove !== null) {
            const nextFen = game.fen();

            onMove(nextFen);
          }
        }}
      />
      <div className={cls.bottomPlayerInfo}>
        <div style={{ width: '33%', textAlign: 'left' }}>
          {props.players[awayColor].name.replace(/^\w/, (c) => c.toUpperCase())}
        </div>
        <div style={{ width: '33%', textAlign: 'center' }}>
          :
        </div>
        <div style={{ width: '33%', textAlign: 'right' }}>
          {props.players[props.homeColor].name.replace(/^\w/, (c) => c.toUpperCase())}
        </div>
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    backgroundColor: '#272729',
    boxShadow: '1px 1px 20px rgba(20, 20, 20, 0.27)',
    borderRadius: '3px',
    display: 'flex',
    flexDirection: 'column',
    width: 'fit-content',
  },
  topScoreInfo: {
    fontFamily: 'Roboto',
    fontSize: '22px',
    color: 'white',
    fontWeight: 300,
    padding: '8px',
    display: 'flex',
    flexDirection: 'row',
  },
  bottomPlayerInfo: {
    fontFamily: 'Roboto',
    fontSize: '18px',
    color: 'white',
    fontWeight: 300,
    padding: '8px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
