import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AwesomeLoader } from 'src/components/AwesomeLoader';
import { createUseStyles } from 'src/lib/jss';
import { useMyPeer } from 'src/providers/PeerProvider/hooks';
import { useDeviceSize } from 'src/theme/hooks/useDeviceSize';
import { console } from 'window-or-global';
import { AnalysisActivityContainer } from '../Room/RoomActivity/activities/AnalysisActivity/AnalysisActivityContainer';
import { RoomAnalysisActivity } from '../Room/RoomActivity/activities/AnalysisActivity/types';
import { ActivityGenericLayout } from './ActivityGenericLayout';
import { getAnalysis } from './resources';

type Props = {};

export const ActivityRoute: React.FC<Props> = (props) => {
  const cls = useStyles();
  const params = useParams<{ id: string }>();
  const deviceSize = useDeviceSize();
  const [analysisActivity, setAnalysisActivity] = useState<RoomAnalysisActivity>();
  // const myPeer = useMyPeer();

  useEffect(() => {
    console.log('params', params);

    if (params.id) {
      getAnalysis({ id: params.id }).map((analysis) => {
        setAnalysisActivity({
          type: 'analysis',
          analysisId: analysis.id,
          analysis,
          participants: {
            // [myPeer?.id]: myPeer,
          }, // add the me peer
        });
      });
    }
  }, [params]);

  if (!analysisActivity) {
    return <AwesomeLoader />;
  }

  return (
    <ActivityGenericLayout
      renderActivity={({ leftSide, boardSize }) => (
        <AnalysisActivityContainer
          deviceSize={deviceSize}
          leftSide={leftSide}
          boardSize={boardSize}
          activity={analysisActivity}
        />
      )}
    />
  );
};

const useStyles = createUseStyles({
  container: {},
});
