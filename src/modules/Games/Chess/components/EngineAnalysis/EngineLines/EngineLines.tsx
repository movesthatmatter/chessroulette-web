import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import { EngineAnalysisRecord } from '../types';
import { EngineLine } from './EngineLine';

type Props = {
  lines: EngineAnalysisRecord['info'];
};

export const EngineLines: React.FC<Props> = ({ lines }) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      {lines.map((line) => (
        <EngineLine
          key={`${line.type}-${line.type === 'depthLine' ? line.pv : line.string}`}
          className={cls.line}
          line={line}
        />
      ))}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
  line: {
    marginBottom: spacers.small,
  },
  text: {
    fontSize: '14px',
  },
});
