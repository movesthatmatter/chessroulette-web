import React from 'react';
import { TournamentMatchRecord } from '../../types';
import { RelativeLink } from 'src/components/RelativeLink';
import { PendingMatch } from './PendingMatch';
import { CompletedMatch } from './CompletedMatch';
import { ProgressMatch } from './ProgressMatch';

type Props = {
  match: TournamentMatchRecord;
};

export const MatchViewer: React.FC<Props> = ({ match }) => {
  if (match.state === 'pending') {
    return (
      <RelativeLink to={`/matches/${match.slug}`}>
        <PendingMatch />
      </RelativeLink>
    );
  }

  if (match.state === 'complete') {
    return (
      <RelativeLink to={`/matches/${match.slug}`}>
        <CompletedMatch match={match} />
      </RelativeLink>
    );
  }

  return (
    <RelativeLink to={`/matches/${match.slug}`}>
      <ProgressMatch match={match} />
    </RelativeLink>
  );
};
