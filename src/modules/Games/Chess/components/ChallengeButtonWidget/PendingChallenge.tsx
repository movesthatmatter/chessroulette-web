import { ChallengeRecord } from 'dstnd-io';
import { Box } from 'grommet';
import { Text } from 'src/components/Text';
import React, { useState } from 'react';
import { AwesomeLoader } from 'src/components/AwesomeLoader';
import { Button } from 'src/components/Button';
import { ClipboardCopy } from 'src/components/CipboardCopy'
import { createUseStyles } from 'src/lib/jss';
import { toChallengeUrlPath } from 'src/lib/util';

export type PendingChallengeProps = {
  challenge: ChallengeRecord;
  type: 'challenge' | 'quickPairing';
};

export const PendingChallenge: React.FC<PendingChallengeProps> = (props) => {
  const cls = useStyles();
  const [copiedMagicLink, setCopiedMagicLink] = useState(false);

  return (
    <Box gap="small" width="medium" className={cls.container}>
      {props.type === 'quickPairing' ? (
        <>
          <Box margin={{ bottom: 'medium' }}>
            <Text>Waiting for opponent...</Text>
            <AwesomeLoader minimal />
          </Box>
          <Box>
            <Text size="small1">But in the meantime, you can send the Magic Link to a friend</Text>
          </Box>
        </>
      ) : (
        <Box>
          <Text>Send Magic Link to a friend</Text>
        </Box>
      )}
      <ClipboardCopy
        value={`${window.location.origin}/${toChallengeUrlPath(props.challenge)}`}
        autoCopy
        onCopied={() => setCopiedMagicLink(true)}
      />
    </Box>
  );
};

const useStyles = createUseStyles({
  container: {
    textAlign: 'center',
  },
});