import { ChessGameColor } from 'dstnd-io';
import { JoinMatchAsPlayer } from 'dstnd-io/dist/resourceCollections/tournaments';
import { ChallongeMatchRecord } from 'dstnd-io/dist/resourceCollections/tournaments/records';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { createUseStyles } from 'src/lib/jss';
import { toRoomUrlPath } from 'src/lib/util';
import { useAuthenticatedUser } from 'src/services/Authentication';
import { spacers } from 'src/theme/spacers';
import { joinMatchAsPlayer } from '../../resources';

type Props = {
  match: ChallongeMatchRecord;
  participating: ChessGameColor | undefined;
};

export const Match: React.FC<Props> = ({ match, participating }) => {
  const cls = useStyles();
  const user = useAuthenticatedUser();
  const history = useHistory();
  return (
    <div className={cls.container}>
      <div
        style={{
          color: participating ? 'red' : 'white',
        }}
      >
        {participating && match.underway_at && (
          <Button
            label={match.id.toString()}
            onClick={() =>
              joinMatchAsPlayer({ matchId: String(match.id) }).map(({ room }) =>
                history.push(toRoomUrlPath(room))
              )
            }
          />
        )}
        {participating && !match.underway_at && <div>{match.id} - participating</div>}
        {!participating && <div>{match.id}</div>}
      </div>
      <div>Status: {match.state}</div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    gap: spacers.default,
  },
});
