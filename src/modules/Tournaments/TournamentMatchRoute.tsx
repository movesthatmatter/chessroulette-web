import React from 'react';
import { Route, Switch, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import { AwesomeErrorPage } from 'src/components/AwesomeError';
import { keyInObject, toDictIndexedBy } from 'src/lib/util';
import { useAuthenticatedUser } from 'src/services/Authentication';
import { TournamentMatchPage } from './TournamentMatchPage';
import { TournamentWithFullDetailsRecord } from './types';
import { TournamentMatchGameAnalysisPage } from './TournamentMatchGameAnalysisPage';

type Props = {
  tournament: TournamentWithFullDetailsRecord;
};

export const TournamentMatchRoute: React.FC<Props> = (props) => {
  const params = useParams<{ matchSlug: string }>();
  const user = useAuthenticatedUser();
  const location = useLocation();
  let { path } = useRouteMatch();

  if (!user) {
    // Show error
    return null;
  }

  const matchesBySlug = toDictIndexedBy(props.tournament.matches, (m) => m.slug);

  if (!keyInObject(matchesBySlug, params.matchSlug)) {
    // Make it a specific 404 for the match
    return <AwesomeErrorPage errorType="resourceNotFound" />;
  }

  const match = matchesBySlug[params.matchSlug];

  return (
    <Switch location={location}>
      <Route exact path={path} key={location.key}>
        <TournamentMatchPage match={matchesBySlug[params.matchSlug]} user={user} />
      </Route>
      {match.state === 'complete' && (
        <Route path={`${path}/analysis`} key={location.key}>
          <TournamentMatchGameAnalysisPage match={match} />
        </Route>
      )}
    </Switch>
  );
};
