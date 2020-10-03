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
  onAccepted: (r: ChallengeAcceptedPayload['content']) => void;
  challenge: ChallengeRecord;
  userId: string;
};

export const PendingChallenge: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [acceptedChallenge, setAcceptedChallenge] = useState<
    ChallengeAcceptedPayload['content'] | undefined
  >();

  useEffect(() => {
    if (acceptedChallenge) {
      props.onAccepted(acceptedChallenge);
    }
  }, [acceptedChallenge]);

  return (
    <SocketConsumer
      onClose={() => {
        // Cancel the challenge if not yet accepted
        if (acceptedChallenge === undefined) {
          props.onCancel();
        }
      }}
      onReady={(socketClient) => {
        socketClient.send({
          kind: 'userIdentification',
          content: { userId: props.userId },
        });
      }}
      onMessage={(msg) => {
        if (msg.kind === 'challengeAccepted') {
          setAcceptedChallenge(msg.content);
        }
      }}
      render={(socket) => (
        <>
          <Box pad="medium" gap="small" width="medium">
            Send this url to a friend
            <ClipboardCopy value={`${window.location.origin}/challenges/${props.challenge.slug}`} />
            <Button
              type="button"
              label="Cancel"
              onClick={socket.close} 
            />
          </Box>
        </>
    )}
    />
  );
};

const useStyles = createUseStyles({
  container: {},
});