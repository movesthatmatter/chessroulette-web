import React, { useEffect, useRef, useState } from 'react';
import Chessground, { ChessgroundProps, ChessgroundApi } from 'react-chessground';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import blueBoard from 'src/modules/Games/Chess/components/ChessBoard/assets/board/blue.svg';
import cx from 'classnames';
import { ChessGameColor, ChessMove, PromotionalChessPieceType } from 'dstnd-io';
import { Square } from 'chess.js';
import { pieces } from '../pieces';
import { noop } from 'src/lib/util';
import 'react-chessground/dist/styles/chessground.css';
import { CustomTheme, softOutline } from 'src/theme';
import {light as lightPieces} from 'src/modules/Games/Chess/components/ChessBoard/assets/pieces/index';
import darkBoard from 'src/modules/Games/Chess/components/ChessBoard/assets/board/blue_darkMode.svg';
import {dark as darkPieces} from 'src/modules/Games/Chess/components/ChessBoard/assets/pieces/index';

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

const useStyles = createUseStyles<CustomTheme>( theme => {
  const colors = theme.name === 'lightDefault' ? {
    image : blueBoard,
    pieces: lightPieces,
    selectedSquare: '#14551e80',
    lastMove: '#9bc70069',
    check: 'radial-gradient(ellipse at center,rgba(255,0,0,1) 0,rgba(231,0,0,1) 25%,rgba(169,0,0,0) 89%,rgba(158,0,0,0) 100%)',
    arrows: {
      color1: '#15781B',
      color2: '#882020',
      color3: '#003088',
      color4: '#e68f00',
    }
  } : {
    image : darkBoard,
    pieces: darkPieces,
    selectedSquare: '#55145380',
    lastMove: '#2e0c2d80',
    check: 'radial-gradient(64.15% 64.15% at 50.28% 50.31%, rgba(206, 24, 107, 0.81) 39.58%, rgba(206, 24, 107, 0) 100%)',
    arrows: {
      color1: '#FF9416',
      color2: '#E485BF',
      color3: '#8354E9',
      color4: '#3BC0C8',
    }
  }
  return {
  container: {
    padding: 0,
    position: 'relative',

    ...({
      '& .cg-wrap': {
        backgroundImage: `url(${colors.image})`,
      },

      '& .cg-wrap piece.rook.white' : {
        backgroundImage: `url(${colors.pieces.wR})`
      },
      '& .cg-wrap piece.queen.white' : {
        backgroundImage: `url(${colors.pieces.wQ})`
      },
      '& .cg-wrap piece.knight.white' : {
        backgroundImage: `url(${colors.pieces.wN})`
      },
      '& .cg-wrap piece.bishop.white' : {
        backgroundImage: `url(${colors.pieces.wB})`
      },
      '& .cg-wrap piece.pawn.white' : {
        backgroundImage: `url(${colors.pieces.wP})`
      },
      '& .cg-wrap piece.king.white' : {
        backgroundImage: `url(${colors.pieces.wK})`
      },

      '& .cg-wrap piece.rook.black' : {
        backgroundImage: `url(${colors.pieces.bR})`
      },
      '& .cg-wrap piece.queen.black' : {
        backgroundImage: `url(${colors.pieces.bQ})`
      },
      '& .cg-wrap piece.knight.black' : {
        backgroundImage: `url(${colors.pieces.bN})`
      },
      '& .cg-wrap piece.bishop.black' : {
        backgroundImage: `url(${colors.pieces.bB})`
      },
      '& .cg-wrap piece.pawn.black' : {
        backgroundImage: `url(${colors.pieces.bP})`
      },
      '& .cg-wrap piece.king.black' : {
        backgroundImage: `url(${colors.pieces.bK})`
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

      '& .cg-wrap svg circle[stroke="#15781B"]' : {
        stroke: `${colors.arrows.color1} !important`,
      },
      '& .cg-wrap svg line[stroke="#15781B"]' : {
        stroke: `${colors.arrows.color1} !important`,
      },
      '& .cg-wrap svg marker[id="arrowhead-g"] path' : {
        fill: `${colors.arrows.color1} !important`,
      },

      '& .cg-wrap svg circle[stroke="#882020"]' : {
        stroke: `${colors.arrows.color2} !important`,
      },
      '& .cg-wrap svg line[stroke="#882020"]' : {
        stroke: `${colors.arrows.color2} !important`,
      },
      '& .cg-wrap svg marker[id="arrowhead-r"] path' : {
        fill: `${colors.arrows.color2} !important`,
      },

      '& .cg-wrap svg circle[stroke="#003088"]' : {
        stroke: `${colors.arrows.color3} !important`,
      },
      '& .cg-wrap svg line[stroke="#003088"]' : {
        stroke: `${colors.arrows.color3} !important`,
      },
      '& .cg-wrap svg marker[id="arrowhead-b"] path' : {
        fill: `${colors.arrows.color3} !important`,
      },

      '& .cg-wrap svg circle[stroke="#e68f00"]' : {
        stroke: `${colors.arrows.color4} !important`,
      },
      '& .cg-wrap svg line[stroke="#e68f00"]' : {
        stroke: `${colors.arrows.color4} !important`,
      },
      '& .cg-wrap svg marker[id="arrowhead-y"] path' : {
        fill: `${colors.arrows.color4} !important`,
      },

      '& cg-board square.check' : {
         background: colors.check,
      },

      '& cg-board square.selected' : {
        backgroundColor: colors.selectedSquare
      },
      '& cg-board square.last-move' : {
        backgroundColor : colors.lastMove
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
}});
