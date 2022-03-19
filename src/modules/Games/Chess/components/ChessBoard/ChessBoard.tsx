import React from 'react';
import { getNewChessGame, toChessColor } from '../../lib';
import { getCurrentChessBoardGameState, isPromotableMove } from './util';
import {
  ChessGameColor,
  ChessGameStateFen,
  ChessGameStatePgn,
  ChessHistory,
  ChessHistoryMove,
  ChessMove,
  GameRecord,
  SimplePGN,
} from 'dstnd-io';
import { StyledChessBoard, StyledChessBoardProps } from './StyledChessBoard';
import { otherChessColor } from 'dstnd-io/dist/chessGame/util/util';
import { ChessBoardConfig, ChessBoardType, ChessBoardGameState } from './types';

export type ChessBoardProps = Omit<StyledChessBoardProps, 'onMove' | 'fen'> & {
  id: GameRecord['id'];
  pgn: GameRecord['pgn'];
  displayable?: {
    fen: ChessGameStateFen;
    pgn: SimplePGN;
    history: ChessHistory;
  };
  type: ChessBoardType;
  config?: ChessBoardConfig;
  playableColor?: ChessGameColor;
  playable?: boolean;
  orientation?: ChessGameColor;
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

type State = {
  current: ChessBoardGameState;
  uncommited?: ChessBoardGameState;
  preMove?: ChessMove | undefined;
  pendingPromotionalMove?: ChessBoardProps['promotionalMove'];
};

export class ChessBoard extends React.PureComponent<ChessBoardProps, State> {
  private chess = getNewChessGame();

  constructor(props: ChessBoardProps) {
    super(props);

    this.chess.load_pgn(this.props.pgn || '');

    this.state = {
      current: getCurrentChessBoardGameState(this.props, this.chess, undefined),
    };

    this.onMove = this.onMove.bind(this);
    this.onPreMove = this.onPreMove.bind(this);
    this.onPreMoveCanceled = this.onPreMoveCanceled.bind(this);
  }

  // Keeps the Component State and the Chess Instance in sync
  private commit() {
    if (!this.props.pgn) {
      this.chess.reset();

      const nextChessState = getCurrentChessBoardGameState(
        this.props,
        this.chess,
        this.state.current
      );

      this.setState({
        current: nextChessState,
        uncommited: undefined,
      });
    } else {
      const loaded = this.chess.load_pgn(this.props.pgn);

      if (loaded) {
        const nextChessState = getCurrentChessBoardGameState(
          this.props,
          this.chess,
          this.state.current
        );

        this.setState({
          current: nextChessState,
          uncommited: undefined,
        });
      }
    }
  }

  componentDidUpdate(prevProps: ChessBoardProps) {
    const chessState = getCurrentChessBoardGameState(this.props, this.chess, this.state.current);
    const { playableColor } = this.props;

    if (this.state.preMove && chessState.turn === playableColor) {
      this.applyPreMove(this.state.preMove);
    }

    // If there are changes in the pgn, uncommited moves or displayable commit them now!
    if (
      (prevProps.pgn !== this.props.pgn && this.state.current.pgn !== this.state.uncommited?.pgn) ||
      prevProps.displayable?.fen !== this.props.displayable?.fen
    ) {
      // Make sure the PromotionalMode is getting reset when the PGN changes
      this.setState({ pendingPromotionalMove: undefined });

      // Commit the changes
      this.commit();
    }
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

  private onPreMoveCanceled() {
    this.setState({ preMove: undefined });
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
          ...getCurrentChessBoardGameState(this.props, uncommitableChess, this.state.uncommited),
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

    const { displayable, ...propsWithoutDisplayable } = this.props;

    const uncommitedChessState = getCurrentChessBoardGameState(
      // Here I took the displayable out so it doesn't interfere with creating the new
      //  lastMove from scratch!
      propsWithoutDisplayable,
      this.chess,
      this.state.current
    );

    const nextHistoryMove = uncommitedChessState.history[uncommitedChessState.history.length - 1];

    this.setState({ uncommited: uncommitedChessState });

    this.props.onMove({
      move: {
        ...(nextHistoryMove as ChessMove),
        color: toChessColor(nextHistoryMove.color),
        san: nextHistoryMove.san,
      },
      fen: uncommitedChessState.fen,
      pgn: uncommitedChessState.pgn,
    });
  }

  render() {
    const {
      id,
      playable,
      orientation,
      playableColor,
      canInteract = false,
      viewOnly,
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
        viewOnly={viewOnly}
        fen={chessState.displayable.fen}
        lastMove={chessState.displayable.lastMoveFromTo}
        turnColor={chessState.turn}
        check={chessState.inCheck}
        resizable
        movable={chessState.movable}
        orientation={orientation || playableColor}
        onPreMoveCanceled={this.onPreMoveCanceled}
        onPreMove={this.onPreMove}
        onMove={this.onMove}
        promotionalMove={this.state.pendingPromotionalMove}
      />
    );
  }
}
