import React, { useEffect, useState } from 'react';
import { noop } from 'src/lib/util';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { Move } from 'chess.js';
import { ChessBoard } from '../ChessBoard';
import { getNewChessGame } from '../../lib/sdk';
import { ChessPlayers } from '../../records';

type Props = React.HTMLProps<HTMLDivElement> & {
  players: ChessPlayers;
  playable?: boolean;
  allowSinglePlayerPlay?: boolean;
  onMove?: (pgn: string) => void;
  // fen?: string;
  pgn: string;

  // The bottom side
  homeColor: 'white' | 'black';
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
  // fen = getNewChessGame().fen(),
  pgn = '',
  allowSinglePlayerPlay = false,
  playable = true,
  ...props
}) => {
  const cls = useStyles();
  const [gameInstance] = useState(getNewChessGame());
  const [fen, setFen] = useState(gameInstance.fen);
  const [history, setHistory] = useState([] as Move[]);

  const [maxSeconds] = useState(10 * 60);
  const [ellapsedSeconds, setEllapsedSeconds] = useState({
    home: 0,
    away: 0,
  });
  // const;


  const [timer, setTimer] = useState<{minutes: number; seconds: number}>(calcutateTimerDisplay());
  const awayColor = props.homeColor === 'white' ? 'black' : 'white';

  // useEffect(() => [])

  useEffect(() => {
    gameInstance.load_pgn(pgn);
    setFen(gameInstance.fen());
    setHistory(gameInstance.history({ verbose: true }));
  }, [pgn]);

  useEffect(() => {
    const timerInterval = setInterval(() => setTimer(calcutateTimerDisplay()), 1000);
    return () => clearInterval(timerInterval);
  }, []);

  return (
    <div className={cx([cls.container, props.className])}>
      {/* <div className={cls.bar}>
        <span>10:00</span>
      </div> */}
      {/* {props.players[awayColor].name} */}
      {/* <div>{timer.minutes < 10 ? `0${timer.minutes}` : timer.minutes}</div>
        <div>:</div>
        <div>{timer.seconds < 10 ? `0${timer.seconds}` : timer.seconds}</div> */}
      {/* </div> */}
      <ChessBoard
        orientation={props.homeColor}
        position={fen}
        calcWidth={
          // This needs to be smarter
          // To make sure it fits in both width and height
          (p) => Math.min(p.screenWidth * 0.5, p.screenHeight * 0.8)
        }
        history={history}
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
          // see if the move is legal
          const validMove = gameInstance.move({
            from: sourceSquare,
            to: targetSquare,
          });

          if (validMove !== null) {
            // save it here too so it's snappy fast
            setFen(gameInstance.fen());
            onMove(gameInstance.pgn());
          }
        }}
      />
      {/* <div className={cls.bar}>
        <span>10:00</span>
      </div> */}
      {/* {props.players[props.homeColor].name} */}
      {/* <div style={{ width: '33%', textAlign: 'left' }}>
          {props.players[awayColor].name.replace(/^\w/, (c) => c.toUpperCase())}
        </div>
        <div style={{ width: '33%', textAlign: 'center' }}>
          :
        </div>
        <div style={{ width: '33%', textAlign: 'right' }}>
          {props.players[props.homeColor].name.replace(/^\w/, (c) => c.toUpperCase())}
        </div> */}
      {/* </div> */}
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
  bar: {
    fontFamily: 'Roboto',
    fontSize: '22px',
    color: 'white',
    fontWeight: 300,
    // padding: '8px',
    display: 'flex',
    flexDirection: 'row',
  },
  // bottomPlayerInfo: {
  //   fontFamily: 'Roboto',
  //   fontSize: '18px',
  //   color: 'white',
  //   fontWeight: 300,
  //   padding: '8px',
  //   display: 'flex',
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  // },
});
