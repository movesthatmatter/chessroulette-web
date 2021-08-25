import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { useWizard } from 'react-use-wizard';
import { Button } from 'src/components/Button';
import { DialogWizardStep } from 'src/components/DialogWizard/DialogWizardStep';
import { FaceTimeSetup } from 'src/components/FaceTime';

type Props = {
  onSuccess: () => void;
};

export const AVCheckStep: React.FC<Props> = (props) => {
  const cls = useStyles();
  const wizardProps = useWizard();

  return (
    <DialogWizardStep
      title="Wow! You look so ready! 😏"
      buttons={[
        {
          label: 'Prev',
          clear: true,
          onClick: wizardProps.previousStep,
        },
        {
          label: 'Next',
          onClick: props.onSuccess,
        },
      ]}
    >
      <FaceTimeSetup
        onUpdated={(s) => {
          if (s.on) {
            // This is extra, as the Permissions are already granted here
            // bouncer.checkPermissions();
          }
        }}
      />
    </DialogWizardStep>
  );
};

const useStyles = createUseStyles({
  container: {},
});
