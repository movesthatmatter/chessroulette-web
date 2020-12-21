import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { fonts } from 'src/theme';
import { pieces } from '../ChessBoard/assets/chessPiecesChessrouletteTheme';
import cx from 'classnames';

type Props = {
  type: keyof typeof pieces;
  count?: number;
  className?: string;
};

export const Piece: React.FC<Props> = ({
  count = 1,
  ...props
}) => {
  const cls = useStyles();

  return (
    <div className={cx(cls.container, props.className)}>
      <img src={pieces[props.type]} className={cls.image}/>
      {count > 1 && (
        <div className={cls.text}>x{count}</div>
      )}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
  },
  image: {
    flex: 1,
    height: '17px'
  },
  text: {
    ...fonts.small2,
    fontWeight: 300,
    flex: 1,
    lineHeight: '100%',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
});