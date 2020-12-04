import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { Avatar as GAvatar, AvatarProps as GAvatarProps } from 'grommet';
import { floatingShadow } from 'src/theme';
import { onlyMobile } from 'src/theme';

type Props = GAvatarProps & {
  className?: string;
};

export const Avatar: React.FC<Props> = ({
  className,
  ...props
}) => {
  const cls = useStyles();

  return (
    <GAvatar
      size="medium"
      round="large"
      margin={{
        right: 'small'
      }}
      className={cx(cls.container, className)}
      {...props}
    >
      {props.children}
    </GAvatar>
  );
};

const useStyles = createUseStyles({
  container: {
    height: '32px !important',
    width: '32px !important',
    ...floatingShadow,

    ...onlyMobile({
      height: '24px !important',
      width: '24px !important',
    }),
  },
});
