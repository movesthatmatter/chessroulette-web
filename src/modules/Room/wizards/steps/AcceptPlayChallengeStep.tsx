import React from 'react';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { useWizard } from 'react-use-wizard';
import { ChallengeRecord, RoomRecord } from 'dstnd-io';
import { DialogWizardStep } from 'src/components/DialogWizard/DialogWizardStep';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';
import { spacers } from 'src/theme/spacers';
import { Text } from 'src/components/Text';
import { CustomTheme, fonts, onlyMobile } from 'src/theme';
import { UnknownAsyncResult } from 'src/lib/types';

type Props = {
  challenge: ChallengeRecord;
  roomInfo: RoomRecord;
  onAccepted: () => UnknownAsyncResult;
};

export const AcceptPlayChallengeStep: React.FC<Props> = ({ challenge, roomInfo, onAccepted }) => {
  const cls = useStyles();
  const wizardProps = useWizard();

  const acceptAndGoNext = () => {
    return onAccepted().map(() => {
      wizardProps.nextStep();
    });
  };

  return (
    <DialogWizardStep
      title={
        <div className={cls.title}>
          <Text>
            Ready to join the <strong>{roomInfo.name} Room</strong>?
          </Text>
        </div>
      }
      graphic={<Mutunachi mid="16" />}
      buttons={[
        {
          label: 'Accept Challenge',
          withLoader: true,
          onClick: acceptAndGoNext,
        },
      ]}
    >
      <div className={cls.container}>
        <Text>
          You've been challenged to a <b>{challenge.gameSpecs.timeLimit}</b> game!
        </Text>
      </div>
    </DialogWizardStep>
  );
};

const useStyles = createUseStyles(theme => ({
  container: {
    textAlign: 'center',
    color: theme.text.baseColor
  },
  title: {
    ...fonts.subtitle1,
    textAlign: 'center',
    paddingBottom: spacers.default,

    ...onlyMobile({
      ...makeImportant({
        paddingLeft: '18px',
        paddingRight: '18px',
        paddingBottom: '12px',
      }),
    }),
  },
}));
