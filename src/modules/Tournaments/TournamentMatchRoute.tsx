import React, { useMemo } from 'react';
import config from 'src/config';
import { Route, Switch, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import { AwesomeErrorPage } from 'src/components/AwesomeError';
import { toDictIndexedBy } from 'src/lib/util';
import { WithAuthenticatedPage } from 'src/services/Authentication/widgets/WithAuthenticatedPage';
import { TournamentMatchAnalysisPage } from './TournamentMatchAnalysisPage';
import { TournamentMatchPage } from './TournamentMatchPage';
import { TournamentWithFullDetailsRecord } from './types';

type Props = {
  tournament: TournamentWithFullDetailsRecord;
};

export const TournamentMatchRoute: React.FC<Props> = (props) => {
  const params = useParams<{ matchSlug: string }>();
  const location = useLocation();
  const { path } = useRouteMatch();

  const tournamentOrganizerUserId = config.TOURNAMENT_ORGANIZER_ID;

  const matchesBySlug = useMemo(() => toDictIndexedBy(props.tournament.matches, (m) => m.slug), [
    props.tournament.matches,
  ]);

  const match = matchesBySlug[params.matchSlug];

  if (!match) {
    // Make it a specific 404 for the match
    return <AwesomeErrorPage errorType="resourceNotFound" />;
  }

  return (
    <Switch location={location}>
      <Route exact path={path} key={location.key}>
        <TournamentMatchPage
          match={matchesBySlug[params.matchSlug]}
          tournamentOrganizerUserId={tournamentOrganizerUserId}
        />
      </Route>
      {(match.state === 'complete' || match.state === 'inProgress') && (
        <Route path={`${path}/analysis`} key={location.key}>
          <WithAuthenticatedPage
            render={({ user }) => <TournamentMatchAnalysisPage match={match} myUser={user} />}
          />
        </Route>
      )}
    </Switch>
  );
};
