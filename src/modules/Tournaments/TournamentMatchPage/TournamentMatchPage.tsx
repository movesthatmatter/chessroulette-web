import React, { useCallback, useEffect, useState } from 'react';
import { RegisteredUserRecord } from 'chessroulette-io';
import { Page } from 'src/components/Page';
import { RelativeLink } from 'src/components/RelativeLink';
import { playTournamentMatch } from '../resources';
import { TournamentMatchRecord } from '../types';
import { useResource } from 'src/lib/hooks/useResource';
import { TournamentInProgressMatchPage } from '../TournamentInProgressMatchPage';
import { AwesomeLoader } from 'src/components/AwesomeLoader';
import { isDateInThePast } from 'src/modules/Room/util';

type Props = {
  match: TournamentMatchRecord;
  user: RegisteredUserRecord;
};

export const TournamentMatchPage: React.FC<Props> = ({ match: givenMatch, user }) => {
  const [match, setMatch] = useState(givenMatch);
  const playTournamentMatchResource = useResource(playTournamentMatch);

  useEffect(() => {
    setMatch(givenMatch);
  }, [givenMatch]);

  const playMatch = useCallback(() => {
    if (playTournamentMatchResource.isLoading) {
      return;
    }

    playTournamentMatchResource
      .request({
        tournamentId: match.tournamentId,
        matchId: match.id,
      })
      .map(setMatch);
  }, [match, playTournamentMatchResource.isLoading]);

  useEffect(() => {
    if (match.state === 'underway' && isDateInThePast(match.underwayAt)) {
      playMatch();
    }
  }, [match.state]);

  if (match.state === 'inProgress') {
    return <TournamentInProgressMatchPage match={match} />;
  }

  return (
    <Page name="Tournament Match">
      <pre>{JSON.stringify(match, null, 2)}</pre>
      {/* {match.state == 'underway' && <Button label="Play" onClick={playMatch} />} */}
      {match.state == 'complete' && <RelativeLink to="/analysis">Analyze</RelativeLink>}

      {playTournamentMatchResource.isLoading && <AwesomeLoader />}
    </Page>
  );
};
