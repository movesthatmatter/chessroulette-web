import { GameSpecsRecord } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { Dialog } from 'src/components/Dialog/Dialog';
import { CreateChallenge } from '../ChallengeWidget/components/CreateChallenge/CreateChallenge';
import { useLichessProvider } from 'src/modules/LichessPlay/LichessAPI/useLichessProvider';
import { console } from 'window-or-global';

type Props = {
  onCancel: () => void;
  onCreated: () => void;
  onAccepted: () => void;
};

export const LichessChallengeWidget: React.FC<Props> = ({ onAccepted, onCancel, onCreated }) => {
  const [gameSpecs, setGameSpecs] = useState<GameSpecsRecord>({
    timeLimit: 'rapid10',
    preferredColor: 'random',
  });

  const lichess = useLichessProvider();

  useEffect(() => {
    lichess!.onChallengeAccepted(() => {
      onAccepted();
    });
  }, []);

  const onChallenge = () => {
    lichess!.initAndChallenge(gameSpecs);
    onCreated();
  };

  return (
    <Dialog
      visible
      hasCloseButton={false}
      title="Lichess Game"
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
          onClick: onChallenge,
        },
      ]}
    />
  );
};
