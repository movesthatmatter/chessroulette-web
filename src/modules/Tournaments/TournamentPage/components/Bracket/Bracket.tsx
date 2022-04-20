import React, { useEffect, useMemo, useState } from 'react';
import {
  TournamentMatchRecord,
  TournamentWithFullDetailsRecord,
} from 'chessroulette-io/dist/resourceCollections/tournaments/records';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { objectKeys, range } from 'src/lib/util';
import { MatchViewer } from 'src/modules/Tournaments/components/MatchViewer/MatchViewer';
import { indexMatchesByRound } from 'src/modules/Tournaments/utils';
import { spacers } from 'src/theme/spacers';
import { useAuthentication } from 'src/services/Authentication';
import { UserInfoRecord } from 'chessroulette-io';
import { String } from 'window-or-global';

type Props = {
  tournament: TournamentWithFullDetailsRecord;
};

function findMyGame(user: UserInfoRecord, matches: TournamentWithFullDetailsRecord['matches']) {
  return Object.values(matches)
    .filter((m) => m.state !== 'complete')
    .find(
      (m) => m.players && (m.players[0].user.id === user.id || m.players[1].user.id === user.id)
    );
}

export const Bracket: React.FC<Props> = ({ tournament }) => {
  const cls = useStyles();
  const auth = useAuthentication();
  const [myNextGame, setMyNextGame] = useState<TournamentMatchRecord | undefined>(undefined);
  const matchesByRound = useMemo(() => indexMatchesByRound(tournament.matches), [
    tournament.matches.length,
  ]);

  useEffect(() => {
    if (auth.authenticationType !== 'user') {
      return;
    }

    setMyNextGame(findMyGame(auth.user, tournament.matches));
  }, [tournament.matches]);

  const { totalRoundsCount, nonPendingRounds } = useMemo(() => {
    const totalRoundsCount = Object.values(tournament.matches)
      .map((p) => p.round)
      .reduce((prev, next) => (next > prev ? next : prev), 0);

    const nonPendingRounds = Object.values(tournament.matches)
      .filter((p) => p.state !== 'pending')
      .map((p) => p.round)
      .reduce((prev, next) => (next > prev ? next : prev), 0);

    return {
      totalRoundsCount,
      nonPendingRounds: range(nonPendingRounds).map((_, i) => String(i + 1)),
    };
  }, [tournament.matches.length]);

  return (
    <div className={cls.container}>
      {Object.keys(tournament.matches).length === 0 && (
        <Text size="subtitle1">Waiting for tournament to start.</Text>
      )}
      {myNextGame && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacers.large,
            paddingBottom: spacers.default,
          }}
        >
          <Text size="body1" style={{ fontStyle: 'italic', fontWeight: 'bold' }}>
            Your next match:
          </Text>
          <MatchViewer key={myNextGame.id} match={myNextGame} />
        </div>
      )}
      {objectKeys(matchesByRound).map((roundNo) => (
        <div key={`round-${roundNo}`} className={cls.roundContainer}>
          <div>
            <Text
              size="body1"
              style={{ fontStyle: 'italic', fontWeight: 'bold' }}
            >{`Round ${roundNo} of ${totalRoundsCount}`}</Text>
          </div>
          <div className={cls.round}>
            {matchesByRound[roundNo].map((match) => {
              if (match.id !== myNextGame?.id) return <MatchViewer key={match.id} match={match} />;
              return null;
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacers.largest,
    // paddingLeft: spacers.large,
    paddingTop: spacers.largest,
    paddingBottom: spacers.default,
  },
  roundContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacers.default,
    marginBottom: spacers.large,
  },
  round: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    gap: spacers.largest,
  },
});
