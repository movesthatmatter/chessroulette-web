import { ChallengeAcceptedPayload, ChallengeRecord, RoomRecord } from 'dstnd-io';
import { Box, Text } from 'grommet';
import React, { useEffect, useState } from 'react';
import { AwesomeLoader } from 'src/components/AwesomeLoader';
import { Button } from 'src/components/Button';
import { ClipboardCopy } from 'src/components/CipboardCopy'
import { SocketConsumer } from 'src/components/SocketProvider';
import { createUseStyles } from 'src/lib/jss';
import { toChallengeUrlPath } from 'src/lib/util';
import { resources } from 'src/resources';

export type PendingChallengeProps = {
  onCancel: () => void;
  challenge: ChallengeRecord;
  type: 'challenge' | 'quickPairing';
};

export const PendingChallenge: React.FC<PendingChallengeProps> = (props) => {
  const cls = useStyles();

  return (
    <Box pad="medium" gap="small" width="medium" className={cls.container}>
      {props.type === 'quickPairing' ? (
        <>
          <Box margin={{
            bottom: 'medium',
          }}>
            <Text>Waiting for opponent...</Text>
              <AwesomeLoader minimal />
          </Box>
          <Box>
            <Text size="small">But in the meantime, you can send this link to a friend</Text>
          </Box>
        </>
      ) : (
        <Box>
          <Text>Send this link to a friend</Text>
        </Box>
      )}
      <ClipboardCopy value={`${window.location.origin}/${toChallengeUrlPath(props.challenge)}`} />
      <Button
        label="Cancel"
        onClick={props.onCancel}
      />
    </Box>
  );
};

const useStyles = createUseStyles({
  container: {
    textAlign: 'center',
  },
});