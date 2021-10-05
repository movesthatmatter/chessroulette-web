import React, { useEffect, useRef, useState } from 'react';
import Chessground, { ChessgroundProps, ChessgroundApi } from 'react-chessground';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import blueBoard from '../assets/board/blue.svg';
import cx from 'classnames';
import { ChessGameColor, ChessMove, PromotionalChessPieceType } from 'dstnd-io';
import { Square } from 'chess.js';
import { pieces } from '../pieces';
import { noop } from 'src/lib/util';
import 'react-chessground/dist/styles/chessground.css';
import { CustomTheme, softOutline } from 'src/theme';

export type StyledChessBoardProps = Omit<
  ChessgroundProps,
  'width' | 'height' | 'onMove' | 'orientation'
> & {
  className?: string;
  preMoveEnabled?: boolean;
  size: number;
  onMove: (m: ChessMove) => void;
  onPreMove?: (m: ChessMove) => void;
  onPreMoveCanceled?: () => void;
  orientation?: ChessGameColor;
  promotionalMove?: ChessMove & { color: ChessGameColor; isPreMove: boolean };
  overlayComponent?: React.ReactNode | ((p: { size?: number }) => React.ReactNode);
};

const promotionalSquareToPercentage = (move: ChessMove, orientation: ChessGameColor) => {
  const files = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
    f: 6,
    g: 7,
    h: 8,
  };
  const file = files[move.to[0] as keyof typeof files];

  const multiplier = orientation === 'white' ? file - 1 : 8 - file;

  return multiplier * 12.5;
};

export const StyledChessBoard: React.FC<StyledChessBoardProps> = ({
  promotionalMove,
  orientation = 'white',
  onMove,
  onPreMove = noop,
  onPreMoveCanceled = noop,
  ...props
}) => {
  const cls = useStyles();
  const [uniqueKey, setUniquKey] = useState(new Date().getTime());
  const chessgroundRef = useRef<ChessgroundApi>();

  useEffect(() => {
    if (chessgroundRef.current) {
      // Remove the Premove Highlights as soon as the FEN changes
      chessgroundRef.current.cancelPremove();
    }
  }, [props.fen]);

  useEffect(() => {
    setUniquKey(new Date().getTime());
  }, [props.viewOnly]);

  const promote = (promotion: PromotionalChessPieceType) => {
    if (!promotionalMove) {
      return;
    }

    if (promotionalMove.isPreMove) {
      onPreMove({
        ...promotionalMove,
        promotion,
      });
    } else {
      onMove({
        ...promotionalMove,
        promotion,
      });
    }
  };

  return (
    <div
      className={cx(cls.container, props.className)}
      style={{
        ...(props.size && {
          width: props.size,
          height: props.size,
        }),
      }}
    >
      <Chessground
        key={uniqueKey}
        ref={(r) => {
          if (r) {
            // TODO: For some reason this becomes null & then not on every update
            chessgroundRef.current = (r as any).cg;
          }
        }}
        premovable={{
          enabled: props.preMoveEnabled,
          castle: true,
          events: {
            set: (org, dest) => onPreMove({ to: dest as Square, from: org as Square }),
            unset: onPreMoveCanceled,
          },
        }}
        resizable={false}
        draggable={{
          enabled: true,
        }}
        {...(props.size && {
          width: props.size,
          height: props.size,
        })}
        onMove={(orig, dest) => onMove({ to: dest as Square, from: orig as Square })}
        orientation={orientation}
        {...props}
      />
      {promotionalMove && (
        <div className={cls.promoDialogLayer}>
          <div
            className={cls.promoDialogContainer}
            style={{
              left: `${promotionalSquareToPercentage(promotionalMove, orientation)}%`,
            }}
          >
            <div className={cls.promoPiecesContainer}>
              <span role="presentation" onClick={() => promote('q')}>
                <img
                  src={promotionalMove.color === 'white' ? pieces.whiteQueen : pieces.blackQueen}
                  alt="Queen"
                  style={{ width: props.size / 8 }}
                />
              </span>
              <span role="presentation" onClick={() => promote('r')}>
                <img
                  src={promotionalMove.color === 'white' ? pieces.whiteRook : pieces.blackRook}
                  alt="Rook"
                  style={{ width: props.size / 8 }}
                />
              </span>
              <span role="presentation" onClick={() => promote('b')}>
                <img
                  src={promotionalMove.color === 'white' ? pieces.whiteBishop : pieces.blackBishop}
                  alt="Bishop"
                  style={{ width: props.size / 8 }}
                />
              </span>
              <span role="presentation" onClick={() => promote('n')}>
                <img
                  src={promotionalMove.color === 'white' ? pieces.whiteKnight : pieces.blackKnight}
                  alt="Knight"
                  style={{ width: props.size / 8 }}
                />
              </span>
            </div>
          </div>
        </div>
      )}
      {props.overlayComponent}
    </div>
  );
};

const useStyles = createUseStyles<CustomTheme>( theme => ({
  container: {
    padding: 0,
    position: 'relative',

    ...({
      '& .cg-wrap': {
        backgroundImage: `url(${theme.board.image})`,
      },

      '& .cg-wrap piece.rook.white' : {
        backgroundImage: `url(${theme.board.pieces.wR})`
      },
      '& .cg-wrap piece.queen.white' : {
        backgroundImage: `url(${theme.board.pieces.wQ})`
      },
      '& .cg-wrap piece.knight.white' : {
        backgroundImage: `url(${theme.board.pieces.wN})`
      },
      '& .cg-wrap piece.bishop.white' : {
        backgroundImage: `url(${theme.board.pieces.wB})`
      },
      '& .cg-wrap piece.pawn.white' : {
        backgroundImage: `url(${theme.board.pieces.wP})`
      },
      '& .cg-wrap piece.king.white' : {
        backgroundImage: `url(${theme.board.pieces.wK})`
      },

      '& .cg-wrap piece.rook.black' : {
        backgroundImage: `url(${theme.board.pieces.bR})`
      },
      '& .cg-wrap piece.queen.black' : {
        backgroundImage: `url(${theme.board.pieces.bQ})`
      },
      '& .cg-wrap piece.knight.black' : {
        backgroundImage: `url(${theme.board.pieces.bN})`
      },
      '& .cg-wrap piece.bishop.black' : {
        backgroundImage: `url(${theme.board.pieces.bB})`
      },
      '& .cg-wrap piece.pawn.black' : {
        backgroundImage: `url(${theme.board.pieces.bP})`
      },
      '& .cg-wrap piece.king.black' : {
        backgroundImage: `url(${theme.board.pieces.bK})`
      },

      '& cg-helper': {
        // Override the default "display: table" because the paddingBottom
        //  of a table doesn't always equal the width of the same element
        display: 'block',
      },

      '& piece': {
        top: '.5%',
        left: '.5%',
        width: '11%',
        height: '11%',
      },

      '& .cg-wrap coords.ranks': {
        top: '-4.5%',
        left: '.5%',
        '& coord': {
          textTransform: 'none',
          color: '#dee3e6',
          fontSize: '11px',

          '&:nth-child(even)': {
            color: '#8ca2ad',
          },
        },
      },
      '& cg-board square.selected' : {
        backgroundColor: theme.board.selectedSquare
      },
      '& cg-board square.last-move' : {
        backgroundColor : theme.board.lastMove
      },
      '& .cg-wrap coords.files': {
        bottom: '0%',
        left: '5%',
        fontSize: '11px',

        '& coord': {
          textTransform: 'none',
          color: '#dee3e6',

          '&:nth-child(even)': {
            color: '#8ca2ad',
          },
        },
      },

      // Reverse it for black orientation
      '& .orientation-black coords.ranks coord': {
        color: '#8ca2ad !important',

        '&:nth-child(even)': {
          color: '#dee3e6 !important',
        },
      },
      '& .orientation-black coords.files coord': {
        color: '#8ca2ad !important',

        '&:nth-child(even)': {
          color: '#dee3e6 !important',
        },
      },
    } as CSSProperties),
  },
  promoDialogLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    background: `rgba(0, 0, 0, .3)`,
    zIndex: 9,
  },
  promoDialogContainer: {
    background: 'white',
    position: 'absolute',
    top: 0,
  },
  promoPiecesContainer: {
    textAlign: 'center',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
  },
}));
