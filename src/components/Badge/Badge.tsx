import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { colors } from 'src/theme';
import { Text, TextProps } from '../Text';
import { CSSProperties } from 'src/lib/jss/types';
import cx from 'classnames';
import { getBoxShadow } from 'src/theme/util';
import hexToRgba from 'hex-to-rgba';

export type BadgeProps = {
  text: string;
  color: keyof typeof colors;
  className?: string;
  style?: CSSProperties;
  textSize?: TextProps['size'];
  textClassName?: string;
};

export const Badge: React.FC<BadgeProps> = ({ textSize = 'small2', ...props }) => {
  const cls = useStyles();

  return (
    <div className={cx(props.className, cls.container)} style={props.style}>
      <Text
        size={textSize}
        className={cx(cls.text, props.textClassName)}
        style={{
          backgroundColor: colors[props.color],
          boxShadow: getBoxShadow(0, 2, 4, 0, hexToRgba(colors[props.color], 0.16)),
        }}
      >
        {props.text}
      </Text>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'inline-block',
  },
  text: {
    display: 'block',
    float: 'left',
    borderRadius: '16px',
    padding: '1px 6px 2px',
    color: colors.white,
  },
});
