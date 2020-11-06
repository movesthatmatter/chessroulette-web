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

  // TODO: This is only temporary, until the whole
  //  state will be held in redux
  return (
    <>
      <div style={{
        display: mode === 'facetime' ? 'block' : 'none',
      }}
      >
        {props.facetimeComponent}
      </div>
      <div style={{
        display: mode === 'facetime' ? 'none' : 'block',
      }}
      >
        {props.studyComponent}
      </div>
    </>
  );

  // if (mode === 'facetime') {
  //   return (
  //     <>
  //       {props.facetimeComponent}
  //     </>
  //   );
  // }

  // return (
  //   <>
  //     {props.studyComponent}
  //   </>
  // );
};

const useStyles = createUseStyles({
  container: {},
});
