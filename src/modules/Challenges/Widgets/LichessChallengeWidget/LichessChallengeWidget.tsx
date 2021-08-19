import { AsyncResult, ChallengeRecord, GameSpecsRecord, RegisteredUserRecord, RoomRecord, UserExternalAccountByVendorMap, UserRecord } from 'dstnd-io';
import React, { useEffect, useState } from 'react';
import { Dialog, DialogProps } from 'src/components/Dialog/Dialog';
import { resources } from 'src/resources';
import { Events } from 'src/services/Analytics';
import {getInstance as getLichessGameManager, LichessManagerType} from 'src/modules/LichessPlay/LichessGameManager';
import useInstance from '@use-it/instance';
import { useAuthenticatedUser, useAuthentication } from 'src/services/Authentication';
import { CreateChallenge } from '../ChallengeWidget/components/CreateChallenge/CreateChallenge';
import { useHistory } from 'react-router-dom';
import { console } from 'window-or-global';
import { useLichessProvider } from 'src/modules/LichessPlay/LichessAPI/useLichessProvider';

type Props = {
  onCancel: () => void;
  onCreated: () => void;
  onAccepted : () => void;
}

export const LichessChallengeWidget: React.FC<Props> = ({
  onAccepted,
  onCancel,
  onCreated,
}) => {
  const [gameSpecs, setGameSpecs] = useState<GameSpecsRecord>({
    timeLimit: 'rapid10',
    preferredColor: 'random',
  });
 
  const lichess = useLichessProvider();

  
  useEffect(() => {
    lichess!.onChallengeAccepted(() => {
      console.log('ACCCEPTED!!!')
    })
  },[])

  const onChallenge = () => {
    lichess!.initAndChallenge(gameSpecs);
    onCreated();
  }
  
  // const createChallenge = () => {
  //   lichessManager.sendChallenge(gameSpecs);
  //   onCreated();
  // }

  return (
        <Dialog
          visible
          hasCloseButton={false}
          title='Lichess Game'
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
              onClick: onChallenge
            },
          ]}
        />
  )
};
