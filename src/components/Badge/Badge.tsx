import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { colors } from 'src/theme';
import { Text } from '../Text';
import { CSSProperties } from 'src/lib/jss/types';
import cx from 'classnames';
import { getBoxShadow } from 'src/theme/util';
import hexToRgba from 'hex-to-rgba';


export type BadgeProps = {
  text: string;
  color: keyof typeof colors;
  className?: string;
  style?: CSSProperties;
};

export const Badge: React.FC<BadgeProps> = (props) => {
  const cls = useStyles();

  return (
    <div className={cx(props.className, cls.container)} style={props.style}>
      <Text
        size="small2"
        className={cls.text}
        style={{
          backgroundColor: colors[props.color],
          color: colors.white,
          fontSize: '10px',
          boxShadow: getBoxShadow(0, 2, 4, 0, hexToRgba(colors.negative, 0.16)),
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
    padding: '1px 6px 0px',
  },
});
