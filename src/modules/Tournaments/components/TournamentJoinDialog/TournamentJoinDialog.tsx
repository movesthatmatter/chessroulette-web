import { ChallongeTournamentRecord } from 'dstnd-io/dist/resourceCollections/tournaments/records';
import React from 'react';
import { Button } from 'src/components/Button';
import { Dialog } from 'src/components/Dialog';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';

type Props = {
  tournament: ChallongeTournamentRecord;
  onJoin: () => void;
};

export const TournamentJoinDialog: React.FC<Props> = ({ tournament, onJoin }) => {
  const cls = useStyles();

  return (
    <Dialog
      hasCloseButton
      visible
      content={
        <div className={cls.container}>
          <Text>{tournament.name}</Text>
          <Button type="primary" label="Join" onClick={() => onJoin()} />
        </div>
      }
    />
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacers.small,
  },
});
