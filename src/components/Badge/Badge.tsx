import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Text, TextProps } from '../Text';
import { CSSProperties } from 'src/lib/jss/types';
import cx from 'classnames';
import { CustomTheme } from 'src/theme';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { ColorPalette } from 'src/theme/colors';

export type BadgeProps = {
  text: string;
  color: ColorPalette;
  className?: string;
  style?: CSSProperties;
  textSize?: TextProps['size'];
  textClassName?: string;
};

export const Badge: React.FC<BadgeProps> = ({ textSize = 'small2', ...props }) => {
  const cls = useStyles();
  const {theme} = useColorTheme();
  const colors = theme.colors
  return (
    <div className={cx(props.className, cls.container)} style={props.style}>
      <Text
        size={textSize}
        className={cx(cls.text, props.textClassName)}
        style={{
          backgroundColor: colors[props.color],
          //boxShadow: getBoxShadow(0, 2, 4, 0, hexToRgba(colors[props.color], 0.16)),
          color: theme.name === 'lightDefault' ? 'white' : theme.text.baseColor
        }}
      >
        {props.text}
      </Text>
    </div>
  );
};

const useStyles = createUseStyles(theme => ({
  container: {
    display: 'inline-block',
  },
  text: {
    display: 'block',
    float: 'left',
    borderRadius: '16px',
    padding: '1px 6px 2px',
  },
}));
