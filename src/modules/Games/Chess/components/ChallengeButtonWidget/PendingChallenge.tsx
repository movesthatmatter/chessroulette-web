import { ChallengeAcceptedPayload, ChallengeRecord, RoomRecord } from 'dstnd-io';
import { Box } from 'grommet';
import React, { useEffect, useState } from 'react';
import { AwesomeLoader } from 'src/components/AwesomeLoader';
import { Button } from 'src/components/Button';
import { ClipboardCopy } from 'src/components/CipboardCopy'
import { SocketConsumer } from 'src/components/SocketProvider';
import { createUseStyles } from 'src/lib/jss';
import { resources } from 'src/resources';

type Props = {
  onCancel: () => void;
  challenge: ChallengeRecord;
};

export const PendingChallenge: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <Box pad="medium" gap="small" width="medium">
      Send this url to a friend
      <ClipboardCopy value={`${window.location.origin}/challenges/${props.challenge.slug}`} />
      <Button
        type="button"
        label="Cancel"
        onClick={props.onCancel}
      />
    </Box>
  );
};

const useStyles = createUseStyles({
  container: {},
});