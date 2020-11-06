import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Layer, LayerProps } from 'grommet';

type Props = LayerProps & {
  visible: boolean;
};

export const Modal: React.FC<Props> = (props) => {
  const cls = useStyles();

  if (!props.visible) {
    return null;
  }

  return <Layer className={cls.container} {...props} />;
};

const useStyles = createUseStyles({
  container: {},
});
