import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTournamentWithFullDetails } from './resources';
import { TournamentWithFullDetailsRecord } from './types';
import { Route, Switch, useLocation, useRouteMatch } from 'react-router-dom';
import { TournamentPage } from './TournamentPage';
import { TournamentMatchRoute } from './TournamentMatchRoute';
import { TournamentWithFullDetailsMocker } from './mocks/TournamentWithFullDetailsMocker';
import { AwesomeLoaderPage } from 'src/components/AwesomeLoader';
import { useResource } from 'src/lib/hooks/useResource';
import { AwesomeErrorPage } from 'src/components/AwesomeError';
import { useAuthentication } from 'src/services/Authentication';
import { usePeerToServerConnection } from 'src/providers/PeerConnectionProvider';

type Props = {};

const mockedTournament = new TournamentWithFullDetailsMocker().started(8, {
  withLive: true,
  withUnderway: true,
});

export const TournamentDetailsRoute: React.FC<Props> = React.memo(() => {
  const params = useParams<{ slug: string }>();
  const location = useLocation();
  let { path } = useRouteMatch();
  const pc = usePeerToServerConnection();

  const [tournament, setTournament] = useState<TournamentWithFullDetailsRecord>();

  // TODO: Don't leave it as cached resource!
  const getTournamentWithFullDetailsResource = useResource(getTournamentWithFullDetails);

  useEffect(() => {
    getTournamentWithFullDetailsResource.request({ tournamentId: params.slug }).map(setTournament);
    // setTournament(mockedTournament);
  }, [params.slug]);

  useEffect(() => {
    if (!(pc.ready && tournament?.id)) {
      return;
    }

    pc.connection.send({
      kind: 'subscribeToResource',
      content: {
        resourceType: 'tournament',
        resourceId: tournament.id,
      },
    });

    const unsubscibers = [
      pc.connection.onMessage((msg) => {
        if (
          msg.kind === 'subscribedResourceUpdated' &&
          msg.content.resourceType === 'tournament' &&
          msg.content.resourceId === tournament?.id
        ) {
          setTournament((prev) => {
            if (!prev) {
              return prev;
            }

            if (msg.content.field === 'partialMatches') {
              return {
                ...prev,
                matches: {
                  ...prev.matches,
                  ...msg.content.next,
                },
              };
            }

            if (msg.content.field === 'partialParticipants') {
              return {
                ...prev,
                participants: {
                  ...prev.participants,
                  ...msg.content.next,
                },
              };
            }

            if (msg.content.field === 'root') {
              return {
                ...prev,
                ...msg.content.next,
              };
            }

            return prev;
          });
        }
      }),
    ];

    return () => {
      pc.connection.send({
        kind: 'unsubscribeFromResource',
        content: {
          resourceId: tournament.id,
          resourceType: 'tournament',
        },
      });

      unsubscibers.forEach((unsubscribe) => unsubscribe());
    };
  }, [pc.ready, tournament?.id]);

  if (getTournamentWithFullDetailsResource.hasFailed) {
    return <AwesomeErrorPage />;
  }

  if (tournament) {
    return (
      <Switch location={location}>
        <Route exact path={path} key={location.key}>
          <TournamentPage tournament={tournament} />
        </Route>
        <Route path={`${path}/matches/:matchSlug`} key={location.key}>
          <TournamentMatchRoute tournament={tournament} />
        </Route>
      </Switch>
    );
  }

  return <AwesomeLoaderPage />;
});
