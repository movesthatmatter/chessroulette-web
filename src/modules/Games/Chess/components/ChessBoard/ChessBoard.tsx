import React from 'react';
import { ChessInstance } from 'chess.js';
import { getNewChessGame, toChessColor } from '../../lib';
import { isPromotableMove, toDests } from './util';
import {
  ChessGameColor,
  ChessGameStateFen,
  ChessGameStatePgn,
  ChessHistoryMove,
  ChessMove,
  GameRecord,
} from 'dstnd-io';
import { StyledChessBoard, StyledChessBoardProps } from './StyledChessBoard';
import { otherChessColor } from 'dstnd-io/dist/chessGame/util/util';
import { ChessgroundProps } from 'react-chessground';

export type ChessBoardProps = Omit<StyledChessBoardProps, 'onMove' | 'fen'> & {
  id: GameRecord['id'];
  pgn: GameRecord['pgn'];
  type: 'play' | 'analysis' | 'free';
  config?: {
    showDests?: boolean;
  };
  homeColor: ChessGameColor;
  orientation?: ChessGameColor;
  playable?: boolean;
  canInteract?: boolean;

  // This speeds up rendering as it doesn't wait for the
  //  move to be saved first
  autoCommitMove?: boolean;
  onMove: (p: {
    move: Omit<ChessHistoryMove, 'clock'>;
    fen: ChessGameStateFen;
    pgn: ChessGameStatePgn;
  }) => void;
  onPreMove?: (m: ChessMove) => void;
};

type ChessState = {
  fen: ChessGameStateFen;
  pgn: ChessGameStatePgn;
  turn: ChessGameColor;
  inCheck: boolean;
  lastMove: ChessMove | undefined;
  isPreMovable: boolean;
};

type State = {
  current: ChessState;
  uncommited?: ChessState;
  preMove?: ChessMove | undefined;
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
    isPreMovable: history.length === 0 ? true : history[history.length - 1].color !== chess.turn(),
  };
};

export class ChessBoard extends React.Component<ChessBoardProps, State> {
  private chess = getNewChessGame();

  constructor(props: ChessBoardProps) {
    super(props);

    this.chess.load_pgn(this.props.pgn || '');

    this.state = {
      current: getCurrentChessState(this.chess),
    };
  }

  // Keeps the Component State and the Chess Instance in sync
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

  componentDidUpdate(prevProps: ChessBoardProps) {
    const chessState = getCurrentChessState(this.chess);
    const { homeColor } = this.props;

    if (this.state.preMove && chessState.turn === homeColor) {
      this.applyPreMove(this.state.preMove);
    }

    // If there are changes in the pgn and uncommited moves, commit them now!
    if (prevProps.pgn !== this.props.pgn) {
      this.commit();
    }
  }

  private calcMovable(): ChessgroundProps['movable'] {
    const base = {
      free: false,
      // This is what determines wether someone can move a piece!
      dests: this.props.canInteract && this.props.playable ? toDests(this.chess) : undefined,
      showDests: !!this.props.config?.showDests,
    } as const;

    if (this.props.type === 'analysis') {
      return {
        ...base,
        color: 'both',
      };
    }

    if (this.props.type === 'play') {
      return {
        ...base,
        color: this.props.homeColor,
      };
    }

    return {
      ...base,
      free: true,
      color: 'both',
    };
  }

  private applyPreMove(preMove: ChessMove) {
    this.onMove(preMove);

    this.setState({ preMove: undefined });
  }

  private onPreMove(nextPreMove: ChessMove) {
    if (!this.props.canInteract) {
      return;
    }

    const movedPiece = this.chess.get(nextPreMove.from);

    if (movedPiece && this.isPromotable(nextPreMove)) {
      // If the premove is a promotional move:
      //  - show the Promotional Dialog inside the ChessBoard
      //  - and wait for the player to select the Piece to promote before applying it
      this.setState({
        pendingPromotionalMove: {
          ...nextPreMove,
          color: toChessColor(movedPiece.color),
          isPreMove: true,
        },
      });

      return;
    }

    this.setState({
      preMove: nextPreMove,
      pendingPromotionalMove: undefined,
    });
  }

  private isPromotable(m: ChessMove) {
    const movedPiece = this.chess.get(m.from);

    return !m.promotion && movedPiece && isPromotableMove(movedPiece, m);
  }

  private onMove(nextMove: ChessMove) {
    if (!this.props.canInteract) {
      return;
    }

    this.setState({
      pendingPromotionalMove: undefined,
    });

    // If the move is a promotional move:
    //  - save a temporary chess state
    //  - show the Promotional Dialog inside the ChessBoard
    //  - and wait for the player to select the Piece to promote
    if (this.isPromotable(nextMove)) {
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
          color: otherChessColor(toChessColor(uncommitableChess.turn())),
          isPreMove: false,
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
    const history = this.chess.history({ verbose: true });
    const nextHistoryMove = history[history.length - 1];

    this.setState({
      uncommited: nextChessState,
    });

    this.props.onMove({
      move: {
        ...(nextHistoryMove as ChessMove),
        color: toChessColor(nextHistoryMove.color),
        san: nextHistoryMove.san,
      },
      fen: nextChessState.fen,
      pgn: nextChessState.pgn,
    });
  }

  render() {
    const {
      pgn,
      id,
      playable,
      orientation,
      homeColor,
      canInteract = false,
      ...boardProps
    } = this.props;
    const chessState = this.state.uncommited || this.state.current;

    return (
      <StyledChessBoard
        // Reset the Board anytime the game changes
        key={id}
        {...boardProps}
        disableContextMenu
        preMoveEnabled={this.props.canInteract && this.state.current.isPreMovable}
        viewOnly={false}
        fen={chessState.fen}
        turnColor={chessState.turn}
        check={chessState.inCheck}
        resizable
        movable={this.calcMovable()}
        lastMove={chessState.lastMove && [chessState.lastMove.from, chessState.lastMove.to]}
        orientation={orientation || homeColor}
        onPreMove={(preMove) => this.onPreMove(preMove)}
        onPreMoveCanceled={() => this.setState({ preMove: undefined })}
        onMove={(m) => this.onMove(m)}
        promotionalMove={this.state.pendingPromotionalMove}
      />
    );
  }
}
