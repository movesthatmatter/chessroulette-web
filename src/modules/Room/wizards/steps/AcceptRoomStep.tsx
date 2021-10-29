import React from 'react';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { useWizard } from 'react-use-wizard';
import { RoomChallengeRecord, RoomRecord } from 'dstnd-io';
import { DialogWizardStep } from 'src/components/DialogWizard/DialogWizardStep';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';
import { spacers } from 'src/theme/spacers';
import { Text } from 'src/components/Text';
import { CustomTheme, fonts, onlyMobile } from 'src/theme';
import { getRoomPendingChallenge } from '../../util';
import { getUserDisplayName } from 'src/modules/User';
import { UnknownAsyncResult } from 'src/lib/types';

type Props = {
  roomInfo: RoomRecord;
  onChallengeSkipped: () => UnknownAsyncResult;
  onChallengeAccepted: (pendingChallenge: RoomChallengeRecord) => UnknownAsyncResult;
};

export const AcceptRoomStep: React.FC<Props> = ({
  roomInfo,
  onChallengeAccepted,
  onChallengeSkipped,
}) => {
  const cls = useStyles();
  const wizardProps = useWizard();
  const pendingChallenge = getRoomPendingChallenge(roomInfo);

  return (
    <DialogWizardStep
      title={
        <div className={cls.title}>
          <Text>
            Ready to join the <strong>{getUserDisplayName(roomInfo.createdByUser)}'s Room</strong>?
          </Text>
        </div>
      }
      graphic={<Mutunachi mid="16" />}
      buttons={
        pendingChallenge
          ? [
              {
                label: 'Skip',
                clear: true,
                withLoader: true,
                onClick: () =>
                  onChallengeSkipped().map(() => {
                    wizardProps.nextStep();
                  }),
              },
              {
                label: 'Accept Challenge',
                withLoader: true,
                onClick: () =>
                  onChallengeAccepted(pendingChallenge).map(() => {
                    wizardProps.nextStep();
                  }),
              },
            ]
          : [
              {
                label: 'Next',
                onClick: () => {
                  wizardProps.nextStep();
                },
              },
            ]
      }
    >
      <div className={cls.container}>
        {pendingChallenge && (
          <Text>
            There's a pending challenged to a <b>{pendingChallenge.gameSpecs.timeLimit}</b> game!
          </Text>
        )}
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
