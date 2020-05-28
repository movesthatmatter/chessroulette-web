
import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { ChessStudyBoard, ChessStudyBoardProps } from './components/ChessStudyBoard';

export type ChessStudyProps = ChessStudyBoardProps & {
  bottomPadding: number;
  className?: string;
};

export const ChessStudy: React.FC<ChessStudyProps> = ({
  bottomPadding,
  className,
  ...boardProps
}) => {
  const cls = useStyles();

  return (
    <div className={className}>
      <div className={cls.container}>
        <ChessStudyBoard
          orientation="white"
          calcWidth={(p) => (p.screenHeight) - bottomPadding}
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
