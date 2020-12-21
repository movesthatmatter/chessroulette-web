import React from 'react';
import Chessground, { ChessgroundProps } from 'react-chessground';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import 'react-chessground/dist/styles/chessground.css';
import blueBoard from './assets/board/blue.svg';
import cx from 'classnames';

export type ChessboardProps = Omit<ChessgroundProps, 'width' | 'height'> & {
  className?: string;
  size?: number;
};

export const Chessboard: React.FC<ChessboardProps> = (props) => {
  const cls = useStyles();

  return (
    <div className={cx(cls.container, props.className)} style={{
      ...props.size && {
        width: props.size,
        height: props.size,
      }
    }}>
      <Chessground
        resizable={false}
        draggable={{
          enabled: true,
        }}
        {...props.size && {
          width: props.size,
          height: props.size,
        }}
        {...props}
      />
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    padding: 0,
    // position: 'relative',

    // background: 'red',
    // maxWidth: '100%',
    // width: '100%',
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
});
