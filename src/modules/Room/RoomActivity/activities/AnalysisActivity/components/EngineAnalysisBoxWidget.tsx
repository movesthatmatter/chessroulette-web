import React from 'react';
import { useEngineAnalysis } from 'src/modules/Games/Chess/components/EngineAnalysis';
import { EngineAnalysisBox } from './EngineAnalysisBox';

type Props = {
  engineGame: {
    id: string;
    pgn: string;
  };
  containerClassName?: string;
  contentClassName?: string;
};

export const EngineAnalysisBoxWidget: React.FC<Props> = ({ engineGame, ...props }) => {
  const engineAnalysisState = useEngineAnalysis(engineGame);

  return <EngineAnalysisBox engineAnalysisState={engineAnalysisState} {...props} />;
};
