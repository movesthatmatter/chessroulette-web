import React from 'react';
import { createUseStyles } from 'src/lib/jss';

export type BlackBoardProps = {
  mode: 'facetime' | 'study';
  facetimeComponent: React.ReactNode;
  studyComponent: React.ReactNode;
};

export const BlackBoard: React.FC<BlackBoardProps> = ({
  mode = 'facetime',
  ...props
}) => {
  const cls = useStyles();

  if (mode === 'facetime') {
    return (
      <>
        {props.facetimeComponent}
      </>
    );
  }

  return (
    <>
      {props.studyComponent}
    </>
  );
};

const useStyles = createUseStyles({
  container: {},
});
