import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Layer } from 'grommet';
import { AppsRounded } from 'grommet-icons';
import { CustomTheme, floatingShadow, softBorderRadius } from 'src/theme';
import { GameActions } from 'src/modules/Games/GameActions';
import { Text } from 'src/components/Text';
import { spacers } from 'src/theme/spacers';
import { RoomPlayActivityWithGameAndParticipating } from '../../RoomActivity/activities/PlayActivity';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { Modal } from 'src/components/Modal/Modal';

type Props = {
  activity: RoomPlayActivityWithGameAndParticipating;
};

export const MobileGameActionsWidget: React.FC<Props> = ({ activity }) => {
  const cls = useStyles();
  const [show, setShow] = useState(false);
  const {theme} = useColorTheme();
  return (
    <>
      <AppsRounded color='white' onClick={() => setShow(true)} className={cls.button} />
      {show && (
        <Modal
         
          className={cls.mobileGameActionMenuLayer}
          onClose={() => setShow(false)}
        >
          <Text size="subtitle1">What's your next move?</Text>
          <GameActions
            isMobile={true}
            activity={activity}
            onActionTaken={() => {
              setShow(false);
            }}
            className={cls.gameActionButtonsContainer}
          />
        </Modal>
      )}
    </>
  );
};

const useStyles = createUseStyles<CustomTheme>(theme => ({
  container: {},
  button: {
    ...floatingShadow,
  },
  mobileGameActionMenuLayer: {
    ...softBorderRadius,
    ...theme.floatingShadow,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    width: '100%',
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    position:'absolute',
    bottom: 0,
    display:'flex',
    flexDirection:'column',
    padding: `${spacers.default} 0 ${spacers.small}`,
  },
  gameActionButtonsContainer: {
    width: '70%',
    padding: spacers.default,
  },
}));
