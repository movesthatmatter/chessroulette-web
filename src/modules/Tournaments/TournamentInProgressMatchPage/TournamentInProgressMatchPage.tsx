import React, { useMemo } from 'react';
import { TournamentInProgressMatchRecord } from 'chessroulette-io/dist/resourceCollections/tournaments/records';
import { AwesomeErrorPage } from 'src/components/AwesomeError';
import { useAnyUser } from 'src/services/Authentication';
import { isUserAMatchParticipant } from '../utils';
import { PageAsParticipant } from './PageAsParticipant';
import { PageAsNonParticipant } from './PageAsNonParticipant';

type Props = {
  match: TournamentInProgressMatchRecord;
};

export const TournamentInProgressMatchPage: React.FC<Props> = ({ match }) => {
  const user = useAnyUser();
  const iamParticipant = useMemo(() => isUserAMatchParticipant(match, user?.id || ''), [match]);

  if (!user) {
    return <AwesomeErrorPage />;
  }

  if (iamParticipant) {
    return <PageAsParticipant meAsParticipant={user} match={match} />;
  }

  return <PageAsNonParticipant match={match} />;
};
