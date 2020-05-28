import React, {
  useRef, useReducer, useEffect,
} from 'react';
import { PeerConsumer } from 'src/components/PeerProvider';
import { PeerMessageEnvelope } from 'src/components/PeerProvider/records';
import { Room } from 'src/components/RoomProvider';
import { eitherToResult } from 'src/lib/ioutil';
import { ChessStudy, ChessStudyProps } from './ChessStudy';
import {
  reducer, initialState, moveAction, updateAction,
} from './reducer';
import { StudyStateUpdatedPayload, studyStatePayload } from './records';


type PeerRef = {
  room: Room;
  broadcastMessage: (m: PeerMessageEnvelope['message']) => void;
}

type Props = Omit<ChessStudyProps, 'history'> & {
  room: Room;
};

export const ChessStudyContainer: React.FC<Props> = ({
  room,
  ...studyProps
}) => {
  const peerRef = useRef<PeerRef>();
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleMessages = ({ message }: PeerMessageEnvelope) => {
    eitherToResult(studyStatePayload.decode(message))
      .map((msg) => {
        if (msg.kind === 'stateUpdated') {
          dispatch(updateAction(msg.content));
        }
      });
  };

  useEffect(() => {
    const payload: StudyStateUpdatedPayload = {
      kind: 'stateUpdated',
      peerId: room.me.id,
      content: state,
    };
    peerRef.current?.broadcastMessage(payload);
  }, [state]);

  return (
    <PeerConsumer
      onReady={(p) => {
        peerRef.current = p;
      }}
      onPeerMsgReceived={handleMessages}
      render={() => (
        <ChessStudy
          playable
          history={state.history}
          onMove={(m) => dispatch(moveAction(m))}
          position={state.fen}
          {...studyProps}
        />
      )}
    />
  );
};
