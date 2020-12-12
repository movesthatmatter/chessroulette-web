import { ChallengeRecord } from 'dstnd-io';
import { Text } from 'src/components/Text';
import React, { useState } from 'react';
import { AwesomeLoader } from 'src/components/AwesomeLoader';
import { ClipboardCopy } from 'src/components/CipboardCopy';
import { createUseStyles } from 'src/lib/jss';
import { toChallengeUrlPath } from 'src/lib/util';

export type PendingChallengeProps = {
  challenge: ChallengeRecord;
};

export const PendingChallenge: React.FC<PendingChallengeProps> = (props) => {
  const cls = useStyles();
  const [copiedMagicLink, setCopiedMagicLink] = useState(false);

  return (
    <div className={cls.container}>
      <div className={cls.top}>
        {props.challenge.type === 'public' ? (
          <>
            <div className={cls.loader}>
              <AwesomeLoader minimal/>
            </div>
            <Text size="small1">
              Wait here for someone across the world to join or 
              <strong>Share this Magic Link</strong> to a friend!
            </Text>
          </>
        ) : (
          <Text size="small1">Share this Magic Link to a friend</Text>
        )}
      </div>
      <ClipboardCopy
        value={`${window.location.origin}/${toChallengeUrlPath(props.challenge)}`}
        autoCopy
        onCopied={() => setCopiedMagicLink(true)}
      />
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    textAlign: 'center',
    // paddingBottom: '32px',
  },
  loader: {
    paddingBottom: '16px',
  },
  top: {
    paddingBottom: '8px',
  },
});
