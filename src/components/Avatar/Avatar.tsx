import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { Mutunachi } from '../Mutunachi/Mutunachi';
import { AspectRatio, AspectRatioProps } from '../AspectRatio';

type Props = AspectRatioProps & {
  id: string;
  className?: string;
};

export const Avatar: React.FC<Props> = ({
  id,
  aspectRatio = { width: 1, height: 1 },
  className,
  ...props
}) => {
  const cls = useStyles();

  return (
    <AspectRatio
      {...props}
      aspectRatio={aspectRatio}
      className={cx(cls.container, className)}
    >
      <Mutunachi mid={id} />
    </AspectRatio>
  );
};

const useStyles = createUseStyles({
  container: {
    // border: '1px solid #ededed',
  },
});
