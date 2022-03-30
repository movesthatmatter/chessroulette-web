import React from 'react';
import { Button } from 'src/components/Button';
import { createUseStyles } from 'src/lib/jss';
import { useEnterRoom } from 'src/modules/Room/hooks/useEnterRoom';
import { spacers } from 'src/theme/spacers';
import { joinTournamentMatchAsPlayer } from '../../resources';
import { TournamentMatchRecord } from '../../types';

type Props = {
  match: TournamentMatchRecord;
  participating: boolean;
};

export const Match: React.FC<Props> = ({ match, participating }) => {
  const cls = useStyles();
  const enterRoom = useEnterRoom();

  return (
    <div className={cls.container}>
      <div style={{ color: participating ? 'red' : 'white' }}>
        {participating && match.state === 'inProgress' && (
          <Button
            label={String(match.id)}
            onClick={() =>
              joinTournamentMatchAsPlayer({ matchId: String(match.id) }).map(enterRoom)
            }
          />
        )}
        {participating && !match.underwayAt && <div>{match.id} - participating</div>}
        {!participating && <div>{match.id}</div>}
      </div>
      <div>Status: {match.state}</div>
      {match.state === 'completed' && <div>Winner: {match.winner}</div>}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    gap: spacers.default,
  },
});
