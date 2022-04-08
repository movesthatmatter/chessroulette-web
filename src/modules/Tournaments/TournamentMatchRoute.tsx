import React, { useEffect, useMemo, useState } from 'react';
import { Route, Switch, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import { AwesomeErrorPage } from 'src/components/AwesomeError';
import { toDictIndexedBy } from 'src/lib/util';
import { useAuthenticatedUser } from 'src/services/Authentication';
import { TournamentMatchAnalysisPage } from './TournamentMatchAnalysisPage';
import { TournamentMatchPage } from './TournamentMatchPage';
import { TournamentWithFullDetailsRecord } from './types';

type Props = {
  tournament: TournamentWithFullDetailsRecord;
};

export const TournamentMatchRoute: React.FC<Props> = (props) => {
  const params = useParams<{ matchSlug: string }>();
  const user = useAuthenticatedUser();
  const location = useLocation();
  let { path } = useRouteMatch();

  const matchesBySlug = useMemo(() => toDictIndexedBy(props.tournament.matches, (m) => m.slug), [
    props.tournament.matches,
  ]);

  const match = matchesBySlug[params.matchSlug];

  if (!user) {
    // Show error
    return null;
  }

  if (!match) {
    // Make it a specific 404 for the match
    return <AwesomeErrorPage errorType="resourceNotFound" />;
  }

  return (
    <Switch location={location}>
      <Route exact path={path} key={location.key}>
        <TournamentMatchPage match={matchesBySlug[params.matchSlug]} user={user} />
      </Route>
      {(match.state === 'complete' || match.state === 'inProgress') && (
        <Route path={`${path}/analysis`} key={location.key}>
          <TournamentMatchAnalysisPage match={match} myUser={user} />
        </Route>
      )}
    </Switch>
  );
};
