import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { getBoxShadow } from 'src/theme/util';
import hexToRgba from 'hex-to-rgba';
import cx from 'classnames';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { ChessGameColor } from 'chessroulette-io';
import { ColorPalette } from 'src/theme/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChessKnight } from '@fortawesome/free-solid-svg-icons';

export type AvatarProps = {
  className?: string;
  darkBG?: boolean;
  size?: number;
  ignoreBG?: boolean;
  pieceColor: ChessGameColor;
  color: ColorPalette;
};

export const ChessColorAvatar: React.FC<AvatarProps> = ({
  className,
  darkBG = false,
  size = 32,
  ...props
}) => {
  const cls = useStyles();
  const { theme } = useColorTheme();

  const bkgColor = theme.colors[props.color];

  return (
    <div
      className={cx(cls.container, className)}
      style={{
        width: size,
        height: size,
        background: bkgColor,
        ...(theme.name === 'lightDefault' && {
          boxShadow: getBoxShadow(0, 2, 16, 0, hexToRgba(bkgColor, 0.3)),
        }),
      }}
    >
      <FontAwesomeIcon icon={faChessKnight} color={props.pieceColor} />
    </div>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    overflow: 'hidden',
    position: 'relative',
    borderRadius: '50%',
    zIndex: 1,
    boxSizing: 'border-box',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
}));
