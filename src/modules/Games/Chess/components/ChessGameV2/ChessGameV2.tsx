import React from 'react';
import { ChessInstance } from 'chess.js';
import { getNewChessGame, toChessColor } from '../../lib';
import { isPromotableMove, toDests } from './util';
import {
  ChessGameColor,
  ChessGameStateFen,
  ChessGameStatePgn,
  ChessMove,
  GameRecord,
} from 'dstnd-io';
import { ChessBoard, ChessBoardProps } from '../ChessBoardV2';

export type ChessGameV2Props = Omit<ChessBoardProps, 'onMove' | 'fen'> & {
  id: GameRecord['id'];
  pgn: GameRecord['pgn'];
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
  pendingPromotionalMove?: ChessBoardProps['promotionalMove'];
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

export class ChessGameV2 extends React.Component<ChessGameV2Props, State> {
  private chess = getNewChessGame();

  constructor(props: ChessGameV2Props) {
    super(props);

    this.chess.load_pgn(this.props.pgn || '');

    this.state = {
      current: getCurrentChessState(this.chess),
    };
  }

  // Keeps the Component State and the Chess Instnce in sync
  private commit() {
    if (!this.props.pgn) {
      this.chess.reset();

      const nextChessState = getCurrentChessState(this.chess);

      this.setState({
        current: nextChessState,
        uncommited: undefined,
      });
    } else {
      const loaded = this.chess.load_pgn(this.props.pgn);

      if (loaded) {
        const nextChessState = getCurrentChessState(this.chess);

        this.setState({
          current: nextChessState,
          uncommited: undefined,
        });
      }
    }
  }

  componentDidUpdate(prevProps: ChessGameV2Props) {
    // If there are changes in the props commit them
    if (prevProps.pgn !== this.props.pgn) {
      this.commit();
    }
  }

  private calcMovable() {
    return {
      free: false,
      dests: toDests(this.chess),
      color: this.props.homeColor,
    } as const;
  }

  render() {
    const { pgn, id, playable, orientation, homeColor, ...boardProps } = this.props;
    const chessState = this.state.uncommited || this.state.current;

    return (
      <ChessBoard
        // Reset the Board anytime the game changes
        key={id}
        {...boardProps}
        viewOnly={!playable}
        fen={chessState.fen}
        turnColor={chessState.turn}
        check={chessState.inCheck}
        resizable
        coordinates
        movable={this.calcMovable()}
        lastMove={chessState.lastMove && [chessState.lastMove.from, chessState.lastMove.to]}
        orientation={orientation || homeColor}
        onMove={async (nextMove) => {
          this.setState({
            pendingPromotionalMove: undefined,
          });

          const movedPiece = this.chess.get(nextMove.from);

          // If the move is a promotional move:
          //  - save a temporary chess state
          //  - show the Promotional Dialog inside the ChessBoard
          //  - and wait for the player to select the Piece to promote
          if (!nextMove.promotion && movedPiece && isPromotableMove(movedPiece, nextMove)) {
            console.log('is prmotoavle')

            const uncommitableChess = getNewChessGame(this.state.current.pgn);

            const valid = uncommitableChess.move({
              ...nextMove,
              promotion: 'q',
            });

            if (!valid) {
              return;
            }

            this.setState({
              pendingPromotionalMove: {
                ...nextMove,
                color: toChessColor(movedPiece.color),
              },
              uncommited: {
                ...getCurrentChessState(uncommitableChess),
                // This is needed since, as a workaround not to revert the promoting move until 
                //  the player makes a selection, the temporarily promoted piece is a Queen,
                //  and sometimes it can give a check - which of course is incorrect therefore
                //  it must not show
                inCheck: false,
              },
            });

            return;
          }

          const valid = this.chess.move(nextMove);

          if (!valid) {
            return;
          }

          const nextChessState = getCurrentChessState(this.chess);

          this.setState({
            uncommited: nextChessState,
          });

          this.props.onMove({
            move: nextMove,
            fen: nextChessState.fen,
            pgn: nextChessState.pgn,
          });
        }}
        promotionalMove={this.state.pendingPromotionalMove}
      />
    );
  }
}
