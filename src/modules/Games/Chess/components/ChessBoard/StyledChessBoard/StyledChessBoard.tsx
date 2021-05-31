import React, { useEffect, useState } from 'react';
import Chessground, { ChessgroundProps } from 'react-chessground';
import { createUseStyles, CSSProperties, makeImportant } from 'src/lib/jss';
import 'react-chessground/dist/styles/chessground.css';
import blueBoard from '../assets/board/blue.svg';
import cx from 'classnames';
import { DialogContent, DialogContentProps } from 'src/components/Dialog';
import { colors, floatingShadow, onlyMobile, softBorderRadius } from 'src/theme';
import { ChessGameColor, ChessMove, PromotionalChessPieceType } from 'dstnd-io';
import { Square } from 'chess.js';
import { pieces } from '../pieces';

export type StyledChessBoardProps = Omit<
  ChessgroundProps,
  'width' | 'height' | 'onMove' | 'orientation'
> & {
  className?: string;
  size: number;
  notificationDialog?: (p: { size?: number }) => DialogContentProps;
  onMove: (m: ChessMove) => void;
  orientation?: ChessGameColor;
  promotionalMove?: ChessMove & { color: ChessGameColor };
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
  notificationDialog,
  promotionalMove,
  orientation = 'white',
  onMove,
  ...props
}) => {
  const cls = useStyles();
  const [uniqueKey, setUniquKey] = useState(new Date().getTime());

  useEffect(() => {
    setUniquKey(new Date().getTime());
  }, [props.viewOnly]);

  const promote = (promotion: PromotionalChessPieceType) => {
    if (!promotionalMove) {
      return;
    }

    onMove({
      ...promotionalMove,
      promotion,
    });
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
      {notificationDialog && (
        <div className={cls.notificationLayer}>
          <div className={cls.notificationContainer}>
            <DialogContent {...notificationDialog({ size: props.size })} />
          </div>
        </div>
      )}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    padding: 0,
    position: 'relative',

    ...({
      '& .cg-wrap': {
        backgroundImage: `url(${blueBoard})`,
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
  notificationLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    background: `rgba(0, 0, 0, .3)`,
    zIndex: 9,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContainer: {
    ...floatingShadow,
    ...softBorderRadius,
    padding: 0,
    position: 'relative',
    background: colors.white,

    ...makeImportant({
      paddingBottom: '24px',
      borderRadius: '8px',
      minWidth: '240px',
      maxWidth: '360px',
      width: '50%',
    }),

    ...onlyMobile({
      ...makeImportant({
        width: '84%',
        maxWidth: 'none',
        paddingBottom: '16px',
      }),
    }),
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
});
