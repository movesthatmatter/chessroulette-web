import React from 'react';
import { ChessGameColor } from 'chessroulette-io';
import { ChallongeMatchRecord } from 'chessroulette-io/dist/resourceCollections/tournaments/records';
import { Button } from 'src/components/Button';
import { createUseStyles } from 'src/lib/jss';
import { useEnterRoom } from 'src/modules/Room/hooks/useEnterRoom';
import { spacers } from 'src/theme/spacers';
import { joinMatchAsPlayer, proxy } from '../../resources';

type Props = {
  match: ChallongeMatchRecord;
  participating: ChessGameColor | undefined;
};

export const Match: React.FC<Props> = ({ match, participating }) => {
  const cls = useStyles();
  const enterRoom = useEnterRoom();

  return (
    <div className={cls.container}>
      <div
        style={{
          color: participating ? 'red' : 'white',
        }}
      >
        {participating && match.state === 'open' && match.underway_at && (
          <Button
            label={String(match.id)}
            onClick={() =>
              joinMatchAsPlayer({ matchId: String(match.id) }).map(({ room }) => enterRoom(room))
            }
          />
        )}
        {participating && !match.underway_at && <div>{match.id} - participating</div>}
        {!participating && <div>{match.id}</div>}
      </div>
      <div>Status: {match.state}</div>
      {match.winner_id && (
        <div>Winner: {match.winner_id}</div>
      )}
      {/* <Button 
        label="Proxy"
        onClick={() => {
          proxy();
        }}
      /> */}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    gap: spacers.default,
  },
});
