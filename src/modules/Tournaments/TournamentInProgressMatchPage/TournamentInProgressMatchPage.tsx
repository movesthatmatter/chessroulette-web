import React, { useMemo } from 'react';
import { TournamentInProgressMatchRecord } from 'chessroulette-io/dist/resourceCollections/tournaments/records';
import { useAnyUser } from 'src/services/Authentication';
import { isUserAMatchParticipant } from '../utils';
import { PageAsParticipant } from './PageAsParticipant';
import { PageAsNonParticipant } from './PageAsNonParticipant';
import { UserRecord } from 'chessroulette-io';

type Props = {
  match: TournamentInProgressMatchRecord;
  tournamentOrganizerUserId: UserRecord['id'];
};

export const TournamentInProgressMatchPage: React.FC<Props> = ({
  match,
  tournamentOrganizerUserId,
}) => {
  const user = useAnyUser();
  const iamParticipant = useMemo(() => isUserAMatchParticipant(match, user?.id || ''), [match]);

  if (iamParticipant) {
    return (
      <PageAsParticipant tournamentOrganizerUserId={tournamentOrganizerUserId} match={match} />
    );
  }

  return <PageAsNonParticipant match={match} />;
};
