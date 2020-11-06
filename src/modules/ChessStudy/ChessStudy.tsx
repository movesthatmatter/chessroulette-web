
import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { ChessStudyBoard, ChessStudyBoardProps } from './components/ChessStudyBoard';

export type ChessStudyProps = ChessStudyBoardProps & {
  paddingTop?: number;
  paddingBottom?: number;
  className?: string;
};

export const ChessStudy: React.FC<ChessStudyProps> = ({
  paddingTop = 0,
  paddingBottom = 0,
  className,
  ...boardProps
}) => {
  const cls = useStyles();

  return (
    <div className={className}>
      <div
        className={cls.container}
        style={{ paddingTop }}
      >
        <ChessStudyBoard
          orientation="white"
          calcWidth={(p) => p.screenHeight - paddingBottom - paddingTop}
          {...boardProps}
        />
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    margin: '0 auto',
    width: 'fit-content',
  },
});
