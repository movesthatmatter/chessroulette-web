import { ChallengeRecord, RoomRecord, UserRecord } from 'dstnd-io';
import React, { useEffect } from 'react';
import { useSocketState } from 'src/components/SocketProvider';
import { PendingChallengeProps } from './PendingChallenge';
import { AwesomeError } from 'src/components/AwesomeError';
import { PendingChallenge } from './PendingChallenge';

export type PendingChallengeContainerProps = PendingChallengeProps & {
  onChallengeAccepted: (p: {
    id: ChallengeRecord['id']
    chalengeeId: UserRecord['id'],
    room: RoomRecord,
  }) => void;
  challenge: ChallengeRecord;
};

export const PendingChallengeContainer: React.FC<PendingChallengeContainerProps> = (props) => {
  const socketState = useSocketState();

  useEffect(() => {
    if (socketState.status === 'open') {
      const unsubscribe = socketState.socket.onMessage((msg) => {
        if (msg.kind === 'challengeAccepted') {
          props.onChallengeAccepted({
            id: msg.content.id,
            chalengeeId: msg.content.userId,
            room: msg.content.room,
          });
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [socketState]);

  return (<PendingChallenge challenge={props.challenge} />);
};
