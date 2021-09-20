import React, { useState } from 'react';
import { useWizard } from 'react-use-wizard';
import { DialogWizardStep } from 'src/components/DialogWizard/DialogWizardStep';
import { FaceTimeSetup } from 'src/components/FaceTime';

type Props = {
  onSuccess: () => void;
  hasPrev?: boolean;
  submitButtonLabel?: string;
};

type ButtonState = 'notReady' | 'loading' | 'ready';

export const AVCheckStep: React.FC<Props> = ({
  hasPrev = true,
  submitButtonLabel = 'Next',
  ...props
}) => {
  const wizardProps = useWizard();
  const [buttonState, setButtonState] = useState<ButtonState>('notReady');

  return (
    <DialogWizardStep
      title="Wow! You look so ready! 😏"
      buttons={[
        hasPrev
          ? {
              label: 'Prev',
              clear: true,
              onClick: wizardProps.previousStep,
            }
          : undefined,
        {
          label: submitButtonLabel,
          isLoading: buttonState === 'loading',
          disabled: buttonState === 'notReady',
          onClick: props.onSuccess,
        },
      ]}
    >
      <FaceTimeSetup
        onUpdated={({ streamingConfig, isLoading }) => {
          if (isLoading) {
            setButtonState('loading');
          } else {
            setButtonState(streamingConfig.on ? 'ready' : 'notReady');
          }
        }}
      />
    </DialogWizardStep>
  );
};
