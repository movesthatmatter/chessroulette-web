import { FormClose } from 'grommet-icons';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Dialog } from 'src/components/Dialog';
import { Emoji } from 'src/components/Emoji';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { colors } from 'src/theme';
import { useOnLeaveRoute } from './useOnLeaveRoute';

type Props = {};

export const ExitRoomButton: React.FC<Props> = () => {
  const cls = useStyles();
  const [showConfrmation, setShowConfirmation] = useState(false);
  const history = useHistory();

  const unblockRouteTransition = useOnLeaveRoute(() => {
    setShowConfirmation(true);

    return false;
  });

  return (
    <div className={cls.container}>
      <FormClose className={cls.exitIcon} onClick={() => history.push('/')} />
      <Dialog
        visible={showConfrmation}
        onClose={() => setShowConfirmation(false)}
        title="Are you sure you want to leave?"
        contentContainerClass={cls.dialogContentContainer}
        content={
          <>
            <Text size="body1">I'm not gonna get upset! At all...</Text>
            <Emoji symbol="🥺" />
            <br />
            <br />
            <div className={cls.mutunachiContainer}>
              <Mutunachi mid="10" />
            </div>
          </>
        }
        buttonsStacked
        buttons={[
          {
            type: 'negative',
            label: 'Yes. Let me go!',
            onClick: () => unblockRouteTransition(),
          },
          {
            type: 'secondary',
            label: "I'm staying!",
            full: true,
            onClick: () => {
              setShowConfirmation(false);
            },
          },
        ]}
      />
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
  exitIcon: {
    fill: `${colors.neutralDark} !important`,
    stroke: `${colors.neutralDark} !important`,
    cursor: 'pointer',
  },
  dialogContentContainer: {
    textAlign: 'center',
  },
  mutunachiContainer: {
    width: '40%',
    maxWidth: '300px',
    margin: '0 auto',
  },
  mutunachi: {
    height: '100%',
  },
});
