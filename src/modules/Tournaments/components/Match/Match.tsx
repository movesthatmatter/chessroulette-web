import { ChallongeMatchRecord } from 'dstnd-io/dist/resourceCollections/tournaments/records';
import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { useAuthenticatedUser } from 'src/services/Authentication';
import { spacers } from 'src/theme/spacers';

type Props = {
  match: ChallongeMatchRecord;
  participating: boolean;
};

export const Match: React.FC<Props> = ({ match, participating }) => {
  const cls = useStyles();
  const user = useAuthenticatedUser();

  return (
    <div className={cls.container}>
      <div
        style={{
          color: participating ? 'red' : 'white',
        }}
      >
        {match.id}
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
