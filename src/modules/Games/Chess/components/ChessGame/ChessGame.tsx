import React, { useEffect, useState } from 'react';
import { keyInObject, noop } from 'src/lib/util';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { Move, Square } from 'chess.js';
// import { getBoardSize as getDefaultBoardSize } from 'src/modules/GameRoom/util';
import { ChessMove, ChessGameStatePgn, ChessGameColor, ChessGameState } from 'dstnd-io';
import { ChessBoard } from '../ChessBoard';
import { getPgnAfterMove, getSquare, pgnToHistory, toChessColor } from '../../lib/util';
import { CSSProperties } from 'src/lib/jss/types';
import useEventListener from '@use-it/event-listener';
import { useSoundEffects } from '../../useSoundEffects';

export type ChessGameProps = React.HTMLProps<HTMLDivElement> & {
  playable: boolean;
  game: ChessGameState;

  // If true the move will be snappy since it doesn't wait
  //  for the entire state to update (over the network) before
  //  rendering the move. Instead it renders it on drag which is
  //  much more natural!
  maintainPositionLocally?: boolean;

  // The bottom side
  homeColor: ChessGameColor;
  orientation?: ChessGameColor;

  onMove?: (m: ChessMove, pgn: ChessGameStatePgn, history: Move[]) => void;
  onRewind?: () => void;
  onForward?: () => void;
  displayedHistoryIndex?: number;
  onDisplayedHistoryIndexUpdated?: (index: number) => void;

  getBoardSize?: (p: { screenWidth: number; screenHeight: number }) => number;
};

export const ChessGame: React.FunctionComponent<ChessGameProps> = ({
  game,
  onMove = noop,
  onRewind = noop,
  onForward = noop,
  onDisplayedHistoryIndexUpdated = noop,
  displayedHistoryIndex = 0,
  playable = false,
  getBoardSize,
  maintainPositionLocally = true,
  ...props
}) => {
  const cls = useStyles();
  const [history, setHistory] = useState(pgnToHistory(game.pgn || ''));
  const [displayedHistory, setDisplayedHistory] = useState(history);
  const [focusedSquare, setFocusedSquare] = useState<Square>();
  const [orientation, setOrientation] = useState(props.orientation || props.homeColor);
  const [focusedSquareStyle, setFocusedSquareStyle] = useState(
    {} as Partial<{ [sq in Square]: CSSProperties }>
  );
  const [nextUncommittedMove, setNextUncommittedMove] = useState<ChessMove>();

  useSoundEffects(game);

  useEffect(() => {
    if (props.orientation) {
      setOrientation(orientation);
    } else {
      setOrientation(props.homeColor);
    }
  }, [props.homeColor, props.orientation]);

  useEffect(() => {
    setHistory(pgnToHistory(game.pgn || ''));
  }, [game.pgn]);

  useEffect(() => {
    setDisplayedHistory(history.slice(0, history.length - displayedHistoryIndex));
  }, [history, displayedHistoryIndex]);

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
      if (!playable) {
        return;
      }

      const piece = getSquare(game.pgn || '', square);

      // Refocus on current square if there is piece of homecolor (mine)
      if (piece && toChessColor(piece.color) === props.homeColor) {
        return square;
      }

      // Toggle off if clicked on same square
      if (prev === square) {
        return undefined;
      }

      if (prev) {
        setNextUncommittedMove({
          from: prev,
          to: square,
          promotion: 'q', // TODO: don't hardcode the queen
        });

        return undefined;
      }

      return prev;
    });
  };

  useEventListener('keydown', (event: object) => {
    if (!keyInObject(event, 'key')) {
      return;
    }

    if (event.key === 'ArrowRight') {
      if (displayedHistoryIndex > 0) {
        onForward();
      }
    } else if (event.key === 'ArrowLeft') {
      if (displayedHistoryIndex < history.length) {
        onRewind();
      }
    }
  });

  useEffect(() => {
    if (!nextUncommittedMove) {
      return;
    }

    onMoveHandler({
      sourceSquare: nextUncommittedMove.from,
      targetSquare: nextUncommittedMove.to,
    });
    setNextUncommittedMove(undefined);
  }, [nextUncommittedMove]);

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

    getPgnAfterMove(game.pgn || '', nextMove).map((nextPgn) => {
      const nextHistory = pgnToHistory(nextPgn);

      onMove(nextMove, nextPgn, nextHistory);

      if (maintainPositionLocally) {
        setHistory(nextHistory);
      }
    });
  };

  return (
    <div className={cx([cls.container, props.className])}>
      <ChessBoard
        orientation={orientation}
        history={displayedHistory}
        calcWidth={getBoardSize}
        onDrop={onMoveHandler}
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
