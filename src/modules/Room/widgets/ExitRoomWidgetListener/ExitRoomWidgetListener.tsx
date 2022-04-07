import React, { useState } from 'react';
import { Dialog } from 'src/components/Dialog';
import { Emoji } from 'src/components/Emoji';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';
import { Text } from 'src/components/Text';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import { console } from 'window-or-global';
import { useOnLeaveRoute } from './useOnLeaveRoute';

type Props = {};

export const ExitRoomWidgetListener: React.FC<Props> = () => {
  const cls = useStyles();
  const [showConfrmation, setShowConfirmation] = useState(false);

  const unblockRouteTransition = useOnLeaveRoute(() => {
    setShowConfirmation(true);

    return false;
  });

  return (
    <div className={cls.container}>
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
            // clear: true,
            label: 'Yes. Let me go!',
            onClick: () => unblockRouteTransition(),
          },
          {
            // type: theme.name === 'lightDefault' ? 'secondary' : 'positive',
            type: 'positive',
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

const useStyles = createUseStyles((theme) => ({
  container: {},
  exitButton: {
    cursor: 'pointer',
    color: theme.colors.neutralDark,
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 0,

    ...({
      '&:hover $exitIcon': {
        fill: `${theme.colors.neutralDarker} !important`,
        stroke: `${theme.colors.neutralDarker} !important`,
      },
    } as CSSProperties),
  },
  exitIcon: {
    fill: `${theme.colors.neutralDark} !important`,
    stroke: `${theme.colors.neutralDark} !important`,
  },
  exitText: {
    lineHeight: 0,
    background: 'purple',
    margin: 0,
    padding: 0,
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
}));
