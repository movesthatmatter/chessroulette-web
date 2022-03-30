import { GameSpecsRecord } from 'chessroulette-io';
import React, { useEffect, useState } from 'react';
import { Dialog } from 'src/components/Dialog';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';
import { useStateWithPrev } from 'src/lib/hooks/useStateWithPrev';
import { createUseStyles } from 'src/lib/jss';
import { noop } from 'src/lib/util';
import { CreateChallenge } from 'src/modules/Challenges/Widgets/ChallengeWidget/components/CreateChallenge/CreateChallenge';
import { useRoomConsumer } from 'src/modules/Room/RoomConsumers/useRoomConsumer';
import { Room } from 'src/modules/Room/types';
import { getRoomPendingChallenge } from 'src/modules/Room/util';

type Props = {
  visible: boolean;
  initialGameSpecs?: GameSpecsRecord;
  onCancel?: () => void;

  // This can't be on success because we don't get a response from the server
  // We could wait for a response as well but I don't think it's that much needed now
  onSuccess?: (pendingChallenge: Room['pendingChallenges'][0]) => void;
};

export const CreateChallengeDialog: React.FC<Props> = ({
  initialGameSpecs = {
    timeLimit: 'rapid10',
    preferredColor: 'random',
  },
  onCancel = noop,
  onSuccess = noop,
  visible,
}) => {
  const cls = useStyles();
  const roomConsumer = useRoomConsumer();
  const [gameSpecs, setGameSpecs] = useState(initialGameSpecs);
  const [pendingChallenge, setPendingChallenge] = useStateWithPrev(
    roomConsumer && getRoomPendingChallenge(roomConsumer?.room)
  );

  useEffect(() => {
    if (!roomConsumer?.room) {
      return;
    }

    const pendingChallenge = getRoomPendingChallenge(roomConsumer.room);

    if (pendingChallenge) {
      setPendingChallenge(pendingChallenge);
    }
  }, [roomConsumer?.room]);

  useEffect(() => {
    if (!pendingChallenge.current) {
      return;
    }

    if (pendingChallenge.current.id !== pendingChallenge.prev?.id) {
      onSuccess(pendingChallenge.current);
    }
  }, [pendingChallenge]);

  if (!roomConsumer) {
    return null;
  }

  return (
    <Dialog
      visible={visible}
      title="Create a Challenge"
      onClose={onCancel}
      graphic={
        <div className={cls.mutunachiContainer}>
          <Mutunachi mid="9" className={cls.mutunachi} />
        </div>
      }
      content={<CreateChallenge gameSpecs={gameSpecs} onUpdated={setGameSpecs} />}
      buttons={[
        {
          label: 'Cancel',
          type: 'secondary',
          withLoader: true,
          onClick: onCancel,
        },
        {
          label: 'Create',
          type: 'primary',
          withLoader: true,
          onClick: () => {
            roomConsumer.roomActions.switchActivity({
              activityType: 'play',
              creationRecord: 'challenge',
              gameSpecs,
            });
          },
        },
      ]}
    />
  );
};

const useStyles = createUseStyles({
  mutunachiContainer: {
    width: '50%',
    maxWidth: '300px',
    margin: '0 auto',
  },
  mutunachi: {
    height: '100%',
  },
});
