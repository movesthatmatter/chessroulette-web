import { ChallengeRecord, RoomRecord, UserRecord } from 'dstnd-io';
import React from 'react';
import { useSocketOnMessage } from 'src/components/SocketProvider';
import { PendingChallengeProps } from './PendingChallenge';
import { PendingChallenge } from './PendingChallenge';

export type PendingChallengeContainerProps = PendingChallengeProps & {
  onAccepted: (p: {
    id: ChallengeRecord['id']
    chalengeeId: UserRecord['id'],
    room: RoomRecord,
  }) => void;
  onMatched: (p: {
    id: ChallengeRecord['id']
    chalengeeId: UserRecord['id'],
    room: RoomRecord,
  }) => void;
  challenge: ChallengeRecord;
};

export const PendingChallengeContainer: React.FC<PendingChallengeContainerProps> = (props) => {
  useSocketOnMessage((msg) => {
    if (msg.kind === 'challengeAccepted') {
      if (props.challenge.type === 'private') {
        props.onAccepted({
          id: msg.content.id,
          chalengeeId: msg.content.userId,
          room: msg.content.room,
        });
      } else {
        // TODO: This is not 100% true b/c a public challenge could still be
        //  accepted by going through the link. But for the current purposes
        //  it's ok. this is a server change where the payload king is different!
        props.onMatched({
          id: msg.content.id,
          chalengeeId: msg.content.userId,
          room: msg.content.room,
        });
      }
    }
  });

  return (<PendingChallenge challenge={props.challenge} />);
};
