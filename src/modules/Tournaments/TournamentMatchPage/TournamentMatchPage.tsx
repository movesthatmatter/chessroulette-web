import React, { useCallback, useEffect, useState } from 'react';
import { UserRecord } from 'chessroulette-io';
import { Page } from 'src/components/Page';
import { RelativeLink } from 'src/components/RelativeLink';
import { playTournamentMatch } from '../resources';
import { TournamentMatchRecord } from '../types';
import { useResource } from 'src/lib/hooks/useResource';
import { TournamentInProgressMatchPage } from '../TournamentInProgressMatchPage';
import { AwesomeLoader } from 'src/components/AwesomeLoader';
import { isDateInThePast } from 'src/modules/Room/util';
import { createUseStyles } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import { isUserAMatchParticipant } from '../utils';
import { delay } from 'src/lib/time';
import { useAuthentication } from 'src/services/Authentication';
import { Button } from 'src/components/Button';
import { noop } from 'src/lib/util';
import { MatchPageMatchViewer } from '../components/MatchPageMatchViewer/MatchPageMatchViewer';

type Props = {
  match: TournamentMatchRecord;
  tournamentOrganizerUserId: UserRecord['id'];
};

export const TournamentMatchPage: React.FC<Props> = ({
  match: givenMatch,
  tournamentOrganizerUserId,
}) => {
  const [match, setMatch] = useState(givenMatch);
  const playTournamentMatchResource = useResource(playTournamentMatch);
  const cls = useStyles();
  const auth = useAuthentication();

  useEffect(() => {
    setMatch(givenMatch);
  }, [givenMatch]);

  useEffect(() => {
    delay(0.5).then(() => {
      if (auth.authenticationType !== 'user') {
        return;
      }
      if (
        match.state === 'underway' &&
        isDateInThePast(match.underwayAt) &&
        isUserAMatchParticipant(match, auth.user.id)
      ) {
        playMatch();
      }
    });
  }, []);

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

  if (match.state === 'inProgress') {
    return (
      <TournamentInProgressMatchPage
        match={match}
        tournamentOrganizerUserId={tournamentOrganizerUserId}
      />
    );
  }

  return (
    <Page name="Tournament Match">
      <div className={cls.container}>
        <MatchPageMatchViewer match={match} />
        {match.state == 'complete' && (
          <div className={cls.analysis}>
            <RelativeLink to="/analysis">
              <Button label="Open Game in Analysis Mode" type="primary" onClick={noop} />
            </RelativeLink>
          </div>
        )}
      </div>
      {playTournamentMatchResource.isLoading && <AwesomeLoader />}
    </Page>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacers.large,
  },
  analysis: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    paddingTop: spacers.large,
  },
}));
