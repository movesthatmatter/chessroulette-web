import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';

type Props = {
  items: {
    id: string;
    content: React.ReactNode;
  }[];
  className?: string;
};

export const ScrollableList: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <div className={cx(cls.container, props.className)}>
      {props.items.map((item) => (
        <React.Fragment key={item.id}>{item.content}</React.Fragment>
      ))}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    overflowY: 'scroll',
    // overflowX: 'visible',
  },
});
