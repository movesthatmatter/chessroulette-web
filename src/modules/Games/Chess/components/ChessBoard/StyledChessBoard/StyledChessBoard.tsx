import React, { useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import blueBoard from 'src/modules/Games/Chess/components/ChessBoard/assets/board/blue.svg';
import Chessground, { ChessgroundProps, ChessgroundApi } from 'react-chessground';
import { createUseStyles, makeImportant, NestedCSSElement } from 'src/lib/jss';
import { ChessGameColor, ChessMove, PromotionalChessPieceType } from 'dstnd-io';
import { Square } from 'chess.js';
import { noop } from 'src/lib/util';
import 'react-chessground/dist/styles/chessground.css';
import darkBoard from 'src/modules/Games/Chess/components/ChessBoard/assets/board/blue_darkMode.svg';
import { light as lightPieces } from 'src/modules/Games/Chess/components/ChessBoard/assets/pieces/index';
import { dark as darkPieces } from 'src/modules/Games/Chess/components/ChessBoard/assets/pieces/index';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { promotionalSquareToPercentage } from './util';

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

// Note: This is a Pure Component since the botthleneck in moving pieces
//  seems to be around the chessboard rerender
export const StyledChessBoard: React.FC<StyledChessBoardProps> = React.memo(
  ({
    promotionalMove,
    orientation = 'white',
    onMove,
    onPreMove = noop,
    onPreMoveCanceled = noop,
    lastMove = [], // This (not undefined) ensure it gets cleared as well!
    ...props
  }) => {
    const cls = useStyles();
    const [uniqueKey, setUniquKey] = useState(new Date().getTime());
    const chessgroundRef = useRef<ChessgroundApi>();
    const { theme } = useColorTheme();
    const pieces = theme.name === 'lightDefault' ? lightPieces : darkPieces;

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
          lastMove={lastMove}
          {...props}
        />
        {promotionalMove && (
          <div className={cls.promoDialogLayer}>
            <div
              className={cx(
                cls.promoDialogContainer,
                promotionalMove.color !== orientation && cls.promoDialogContainerFlipped
              )}
              style={{
                left: `${promotionalSquareToPercentage(promotionalMove, orientation)}%`,
              }}
            >
              <div className={cls.promoPiecesContainer}>
                <span role="presentation" onClick={() => promote('q')}>
                  <img
                    src={promotionalMove.color === 'white' ? pieces.wQ : pieces.bQ}
                    alt="Queen"
                    style={{ width: props.size / 8 }}
                  />
                </span>
                <span role="presentation" onClick={() => promote('r')}>
                  <img
                    src={promotionalMove.color === 'white' ? pieces.wR : pieces.bR}
                    alt="Rook"
                    style={{ width: props.size / 8 }}
                  />
                </span>
                <span role="presentation" onClick={() => promote('b')}>
                  <img
                    src={promotionalMove.color === 'white' ? pieces.wB : pieces.bB}
                    alt="Bishop"
                    style={{ width: props.size / 8 }}
                  />
                </span>
                <span role="presentation" onClick={() => promote('n')}>
                  <img
                    src={promotionalMove.color === 'white' ? pieces.wN : pieces.bN}
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
  }
);

const useStyles = createUseStyles((theme) => {
  const colors =
    theme.name === 'lightDefault'
      ? {
          image: blueBoard,
          pieces: lightPieces,
          selectedSquare: '#14551e80',
          lastMove: '#9bc70069',
          check:
            'radial-gradient(ellipse at center,rgba(255,0,0,1) 0,rgba(231,0,0,1) 25%,rgba(169,0,0,0) 89%,rgba(158,0,0,0) 100%)',
          arrows: {
            color1: '#15781B',
            color2: '#882020',
            color3: '#003088',
            color4: '#e68f00',
          },
        }
      : {
          image: darkBoard,
          pieces: darkPieces,
          selectedSquare: '#8B239C70',
          lastMove: '#9C1F5B70',
          check:
            'radial-gradient(64.15% 64.15% at 50.28% 50.31%, rgba(206, 24, 107, 0.81) 39.58%, rgba(206, 24, 107, 0) 100%)',
          arrows: {
            color1: '#FF9416',
            color2: '#E485BF',
            color3: '#8354E9',
            color4: '#3BC0C8',
          },
        };
  return {
    container: {
      padding: 0,
      position: 'relative',

      ...({
        '& .cg-wrap': {
          backgroundImage: `url(${colors.image})`,
        },

        '& .cg-wrap piece.rook.white': {
          backgroundImage: `url(${colors.pieces.wR})`,
        },
        '& .cg-wrap piece.queen.white': {
          backgroundImage: `url(${colors.pieces.wQ})`,
        },
        '& .cg-wrap piece.knight.white': {
          backgroundImage: `url(${colors.pieces.wN})`,
        },
        '& .cg-wrap piece.bishop.white': {
          backgroundImage: `url(${colors.pieces.wB})`,
        },
        '& .cg-wrap piece.pawn.white': {
          backgroundImage: `url(${colors.pieces.wP})`,
        },
        '& .cg-wrap piece.king.white': {
          backgroundImage: `url(${colors.pieces.wK})`,
        },

        '& .cg-wrap piece.rook.black': {
          backgroundImage: `url(${colors.pieces.bR})`,
        },
        '& .cg-wrap piece.queen.black': {
          backgroundImage: `url(${colors.pieces.bQ})`,
        },
        '& .cg-wrap piece.knight.black': {
          backgroundImage: `url(${colors.pieces.bN})`,
        },
        '& .cg-wrap piece.bishop.black': {
          backgroundImage: `url(${colors.pieces.bB})`,
        },
        '& .cg-wrap piece.pawn.black': {
          backgroundImage: `url(${colors.pieces.bP})`,
        },
        '& .cg-wrap piece.king.black': {
          backgroundImage: `url(${colors.pieces.bK})`,
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
            fontSize: '12px',
            fontWeight: 'bold',
            color: theme.colors.black,

            '&:nth-child(even)': {
              color: theme.colors.black,
            },
          },
        },
        '& .cg-wrap coords.files': {
          bottom: '0%',
          left: '5%',

          '& coord': {
            textTransform: 'none',
            color: theme.colors.black,
            fontSize: '12px',
            fontWeight: 'bold',

            '&:nth-child(even)': {
              color: theme.colors.black,
            },
          },
        },

        '& .cg-wrap svg circle[stroke="#15781B"]': {
          stroke: `${colors.arrows.color1} !important`,
        },
        '& .cg-wrap svg line[stroke="#15781B"]': {
          stroke: `${colors.arrows.color1} !important`,
        },
        '& .cg-wrap svg marker[id="arrowhead-g"] path': {
          fill: `${colors.arrows.color1} !important`,
        },

        '& .cg-wrap svg circle[stroke="#882020"]': {
          stroke: `${colors.arrows.color2} !important`,
        },
        '& .cg-wrap svg line[stroke="#882020"]': {
          stroke: `${colors.arrows.color2} !important`,
        },
        '& .cg-wrap svg marker[id="arrowhead-r"] path': {
          fill: `${colors.arrows.color2} !important`,
        },

        '& .cg-wrap svg circle[stroke="#003088"]': {
          stroke: `${colors.arrows.color3} !important`,
        },
        '& .cg-wrap svg line[stroke="#003088"]': {
          stroke: `${colors.arrows.color3} !important`,
        },
        '& .cg-wrap svg marker[id="arrowhead-b"] path': {
          fill: `${colors.arrows.color3} !important`,
        },

        '& .cg-wrap svg circle[stroke="#e68f00"]': {
          stroke: `${colors.arrows.color4} !important`,
        },
        '& .cg-wrap svg line[stroke="#e68f00"]': {
          stroke: `${colors.arrows.color4} !important`,
        },
        '& .cg-wrap svg marker[id="arrowhead-y"] path': {
          fill: `${colors.arrows.color4} !important`,
        },

        '& cg-board square.check': {
          background: colors.check,
        },

        '& cg-board square.selected': {
          backgroundColor: colors.selectedSquare,
        },
        '& cg-board square.last-move': {
          backgroundColor: colors.lastMove,
        },
      } as NestedCSSElement),
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
      background: theme.name === 'lightDefault' ? '#fff' : '#092330',
      position: 'absolute',
      top: 0,
    },

    promoDialogContainerFlipped: {
      ...makeImportant({
        top: 'auto',
        bottom: 0,
      }),

      ...{
        '& $promoPiecesContainer': {
          flexDirection: 'column-reverse',
        },
      } as NestedCSSElement,
    },
    promoPiecesContainer: {
      textAlign: 'center',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
    },
  };
});
