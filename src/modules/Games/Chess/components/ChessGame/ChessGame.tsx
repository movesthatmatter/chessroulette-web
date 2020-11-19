import React, { useEffect, useState, useRef } from 'react';
import { noop } from 'src/lib/util';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { Move, Square } from 'chess.js';
import { getBoardSize as getDefaultBoardSize } from 'src/modules/GameRoom/util';
import { ChessMove, ChessGameStatePgn, ChessGameStateFen, ChessGameColor } from 'dstnd-io';
import { ChessBoard } from '../ChessBoard';
import { getNewChessGame } from '../../lib/sdk';
import { getSquareForPiece } from '../../lib/util';
import { CSSProperties } from 'src/lib/jss/types';
import { toChessColor } from './util';
import validMoveSound from '../../assets/sounds/valid_move.wav';
import inCheckSound from '../../assets/sounds/in_check.wav';
import checkMatedSound from '../../assets/sounds/check_mated.wav';

const validMoveAudio = new Audio(validMoveSound);
const inCheckAudio = new Audio(inCheckSound);
const checkMatedAudio = new Audio(checkMatedSound);

type Props = React.HTMLProps<HTMLDivElement> & {
  playable: boolean;
  onMove?: (m: ChessMove, pgn: ChessGameStatePgn, history: Move[]) => void;
  pgn: string;

  // If true the move will be snappy since it doesn't wait
  //  for the entire state to update (over the network) before
  //  rendering the move. Instead it renders it on drag which is
  //  much more natural!
  maintainPositionLocally?: boolean;

  // The bottom side
  homeColor: ChessGameColor;
  orientation?: ChessGameColor;

  getBoardSize?: (p: { screenWidth: number; screenHeight: number }) => number;
};

export const ChessGame: React.FunctionComponent<Props> = ({
  onMove = noop,
  pgn = '',
  playable = false,
  getBoardSize = getDefaultBoardSize,
  maintainPositionLocally = true,
  ...props
}) => {
  const cls = useStyles();
  const gameInstance = useRef(getNewChessGame());
  const [fen, setFen] = useState<ChessGameStateFen>();
  const [history, setHistory] = useState([] as Move[]);
  const [inCheckSquare, setInCheckSquare] = useState<Square>();
  const [focusedSquare, setFocusedSquare] = useState<Square>();
  const [orientation, setOrientation] = useState(props.orientation || props.homeColor);
  const [focusedSquareStyle, setFocusedSquareStyle] = useState(
    {} as Partial<{ [sq in Square]: CSSProperties }>
  );

  useEffect(() => {
    if (props.orientation) {
      setOrientation(orientation);
    } else {
      setOrientation(props.homeColor);
    }
  }, [props.homeColor, props.orientation]);

  useEffect(() => {
    if (!pgn) {
      gameInstance.current = getNewChessGame();
    }

    const validPgn = gameInstance.current.load_pgn(pgn);

    setFen(gameInstance.current.fen());
    setHistory(gameInstance.current.history({ verbose: true }));

    setInCheckSquare(undefined);

    // This shouldn't be here
    if (gameInstance.current.in_check()) {
      setInCheckSquare(
        getSquareForPiece(pgn, { color: gameInstance.current.turn(), type: 'k' })
      );

      if (gameInstance.current.in_checkmate()) {
        checkMatedAudio.play();
      } else {
        inCheckAudio.play();
      }
    } else if (validPgn) {
      validMoveAudio.play();
    }
  }, [pgn]);

  useEffect(() => {
    setFocusedSquareStyle(
      focusedSquare
        ? {
            [focusedSquare]: {
              backgroundColor: 'rgba(255, 255, 0, .4)',
            },
          }
        : {}
    );
  }, [focusedSquare]);

  const onSquareClickHandler = (square: Square) => {
    setFocusedSquare((prev) => {
      const piece = gameInstance.current.get(square);

      // Refocus on current square if there is piece of homecolor (mine)
      if (piece && toChessColor(piece.color) === props.homeColor) {
        return square;
      }

      // Toggle off if clicked on same square
      if (prev === square) {
        return undefined;
      }

      if (prev) {
        // TODO: This probably shouldn't be here since it's inside a setState
        onMoveHandler({
          sourceSquare: prev,
          targetSquare: square,
        });

        return undefined;
      }

      return prev;
    });
  };

  const onMoveHandler = ({
    sourceSquare,
    targetSquare,
  }: {
    sourceSquare: Square;
    targetSquare: Square;
  }) => {
    if (!playable) {
      return;
    }

    const nextMove: ChessMove = {
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // TODO: don't hardcode the queen
    };

    // see if the move is legal
    const validMove = gameInstance.current.move(nextMove);

    if (validMove !== null) {
      onMove(
        nextMove,
        gameInstance.current.pgn(),
        gameInstance.current.history({ verbose: true }),
      );

      if (maintainPositionLocally) {
        setFen(gameInstance.current.fen());
      }
    }
  };

  if (!fen) {
    return null;
  }

  return (
    <div className={cx([cls.container, props.className])}>
      <ChessBoard
        orientation={orientation}
        position={fen}
        history={history}
        calcWidth={getBoardSize}
        onDrop={onMoveHandler}
        inCheckSquare={inCheckSquare}
        onSquareClick={onSquareClickHandler}
        clickedSquareStyle={focusedSquareStyle}
        darkSquareStyle={{
          backgroundColor: '#7D9AC7',
        }}
        lightSquareStyle={{
          backgroundColor: '#DEE5F0',
        }}
        transitionDuration={20}
      />
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
});
