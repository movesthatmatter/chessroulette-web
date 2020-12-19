import React from 'react';
import { ChessInstance, Square } from 'chess.js';
import { getNewChessGame, toChessColor } from '../../lib';
import { toDests } from './util';
import {
  ChessGameColor,
  ChessGameState,
  ChessGameStateFen,
  ChessGameStatePgn,
  ChessMove,
} from 'dstnd-io';
import { Chessboard, ChessboardProps } from '../ChessBoardV2';

type Props = Omit<ChessboardProps, 'onMove' | 'fen'> & {
  game: ChessGameState;
  homeColor: ChessGameColor;
  orientation?: ChessGameColor;
  playable?: boolean;

  // This speeds up rendering as it doesn't wait for the
  //  move to be saved first
  autoCommitMove?: boolean;
  onMove: (p: { move: ChessMove; fen: ChessGameStateFen; pgn: ChessGameStatePgn }) => void;
};

type ChessState = {
  fen: ChessGameStateFen;
  pgn: ChessGameStatePgn;
  turn: ChessGameColor;
  inCheck: boolean;
  lastMove: ChessMove | undefined;
};

type State = {
  current: ChessState;
  uncommited?: ChessState;
};

const getCurrentChessState = (chess: ChessInstance): ChessState => {
  const history = chess.history({ verbose: true });

  return {
    fen: chess.fen(),
    pgn: chess.pgn(),
    turn: toChessColor(chess.turn()),
    inCheck: chess.in_check(),
    lastMove: history[history.length - 1] as ChessMove,
  };
};

export class ChessGameV2 extends React.Component<Props, State> {
  private chess = getNewChessGame();

  constructor(props: Props) {
    super(props);

    this.chess.load_pgn(this.props.game.pgn || '');

    // this.chess.load(this.props.game.fen || '');

    this.state = {
      current: getCurrentChessState(this.chess),
    };
  }

  // Keeps the Component State and the Chess Instnce in sync
  private commit() {
    if (!this.props.game.pgn) {
      this.chess.reset();

      const nextChessState = getCurrentChessState(this.chess);

      this.setState({
        current: nextChessState,
        uncommited: undefined,
      });
    } else {
      const loaded = this.chess.load_pgn(this.props.game.pgn);

      if (loaded) {
        const nextChessState = getCurrentChessState(this.chess);

        this.setState({
          current: nextChessState,
          uncommited: undefined,
        });
      }
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    // If there are changes in the props commit them
    if (prevProps.game.pgn !== this.props.game.pgn) {
      this.commit();
    }
  }

  private calcMovable() {
    return {
      free: false,
      dests: toDests(this.chess),
      color: this.chess.turn() === 'w' ? 'white' : 'black',
    } as const;
  }

  render() {
    const chessState = this.state.uncommited || this.state.current;

    return (
      <Chessboard
        key={this.props.homeColor}
        {...this.props}
        fen={chessState.fen}
        turnColor={chessState.turn}
        check={chessState.inCheck}
        resizable
        coordinates
        viewOnly={!this.props.playable}
        movable={this.calcMovable()}
        lastMove={chessState.lastMove && [chessState.lastMove.from, chessState.lastMove.to]}
        orientation={this.props.orientation || this.props.homeColor}
        onMove={(orig, dest, capturedPiece) => {
          const nextMove: ChessMove = {
            from: orig as Square,
            to: dest as Square,
            promotion: 'q', // TODO: Fix
          };
          const valid = this.chess.move(nextMove);

          if (valid) {
            const nextChessState = getCurrentChessState(this.chess);

            this.setState({
              uncommited: nextChessState,
            });

            this.props.onMove({
              move: nextMove,
              fen: nextChessState.fen,
              pgn: nextChessState.pgn,
            });
          }
        }}
      />
    );
  }
}
