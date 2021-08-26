import { Box } from 'grommet';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, ButtonProps } from 'src/components/Button';
import { Dialog} from 'src/components/Dialog';
import { Text } from 'src/components/Text';
import { useAuthentication } from 'src/services/Authentication';
import { LichessChallengeWidget } from '../LichessChallengeWidget/LichessChallengeWidget';

type Props = Omit<ButtonProps, 'onClick'>;

type State =
  | {
      type: 'challenge';
    }
  | {
      type: 'pending';
    }
  | undefined;

export const LichessChallengeButton: React.FC<Props> = (props) => {
  const [state, setState] = useState<State>(undefined);
  const auth = useAuthentication();
  const [disabledStatus, setDisabledStatus] = useState(true);
  const history = useHistory();
  
  useEffect(() => { 
    setDisabledStatus(() => {
      return auth.authenticationType === 'none' || auth.authenticationType === 'guest' || 
      (auth.authenticationType === 'user' && !auth.user.externalAccounts?.lichess)
    })
  },[auth])

  const popup = () => {
    if (
      state?.type === 'challenge' &&
      !disabledStatus
    ) {
      return (
        <LichessChallengeWidget
          onCancel={() => setState(undefined)}
          onCreated={() => setState({type : 'pending'})}
          onAccepted={() => {
            setState(undefined);
            history.push(`/lichess`);
          }}
        />
      );
    }
    if (state?.type === 'pending') {
      return (
        <Dialog
          visible
          title="Waiting for Opponent"
          content={
            <Box align="center">
              <Text>Waiting for an opponent to accept the challenge.</Text>
            </Box>
          }
          hasCloseButton={false}
          buttons={[
            {
              label: 'Cancel',
              type: 'negative',
              onClick: () => {
                setState(undefined)
              },
            },
          ]}
        />
      );
    }
    return null;
  };

  return (
    <>
      <Button
        onClick={() => {
          setState({type: 'challenge'})
        }}
        {...props}
        disabled={props.disabled || disabledStatus}
      />
      {popup()}
    </>
  );
};

