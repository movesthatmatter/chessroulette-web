/* eslint-disable @typescript-eslint/no-unused-expressions */

import React, { useRef, useEffect } from 'react';
import { PeerConsumer } from 'src/components/PeerProvider';
import { PeerMessageEnvelope } from 'src/components/PeerProvider/records';
import { Room } from 'src/components/RoomProvider';
import { eitherToResult } from 'src/lib/ioutil';
import { useDispatch, useSelector } from 'react-redux';
import { ChessStudy, ChessStudyProps } from './ChessStudy';
import { moveAction, updateAction } from './reducer';
import { StudyStateUpdatedPayload, studyStatePayload } from './records';
import { selectChessStudy } from './selectors';

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
  const dispatch = useDispatch();
  const state = useSelector(selectChessStudy);

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
      // NOTE: This was removed on Sept 6th 2020 when refactoring PeerProvider to RoomProvider
      // onReady={(p) => {
      //   peerRef.current = p;
      // }}
      onPeerMsgReceived={handleMessages}
      renderRoomJoined={() => (
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
