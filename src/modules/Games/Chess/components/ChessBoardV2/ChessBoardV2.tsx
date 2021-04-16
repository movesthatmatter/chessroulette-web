import React, { ReactElement, useEffect, useState } from 'react';
import Chessground, { ChessgroundProps } from 'react-chessground';
import { createUseStyles, CSSProperties, makeImportant } from 'src/lib/jss';
import 'react-chessground/dist/styles/chessground.css';
import blueBoard from './assets/board/blue.svg';
import cx from 'classnames';
import { DialogContent, DialogContentProps } from 'src/components/Dialog';
import { colors, floatingShadow, onlyMobile, softBorderRadius } from 'src/theme';

export type ChessBoardProps = Omit<ChessgroundProps, 'width' | 'height'> & {
  className?: string;
  size?: number;
  notificationDialog?: (p: { size?: number }) => DialogContentProps;
};

export const ChessBoard: React.FC<ChessBoardProps> = ({ notificationDialog, ...props }) => {
  const cls = useStyles();
  const [uniqueKey, setUniquKey] = useState(new Date().getTime());

  useEffect(() => {
    setUniquKey(new Date().getTime());
  }, [props.viewOnly]);

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
        {...props}
      />
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
        top: '-5%',
        left: '.5%',
        // to
        // background: 'red',
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
        // to
        // background: 'red',

        '& coord': {
          textTransform: 'none',
          color: '#dee3e6',

          '&:nth-child(even)': {
            color: '#8ca2ad',
          },
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
    zIndex: 999,

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
});
