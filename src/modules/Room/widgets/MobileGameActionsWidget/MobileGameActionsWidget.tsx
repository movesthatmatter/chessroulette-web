import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Layer } from 'grommet';
import { AppsRounded } from 'grommet-icons';
import { floatingShadow, lightTheme, softBorderRadius } from 'src/theme';
import { GameActions } from 'src/modules/Games/GameActions';
import { Text } from 'src/components/Text';
import { spacers } from 'src/theme/spacers';
import { RoomPlayActivityWithGameAndParticipating } from '../../RoomActivity/activities/PlayActivity';

type Props = {
  activity: RoomPlayActivityWithGameAndParticipating;
};

export const MobileGameActionsWidget: React.FC<Props> = ({ activity }) => {
  const cls = useStyles();
  const [show, setShow] = useState(false);
  return (
    <>
      <AppsRounded color={lightTheme.colors.white} onClick={() => setShow(true)} className={cls.button} />
      {show && (
        <Layer
          responsive={false}
          position="bottom"
          animation="slide"
          className={cls.mobileGameActionMenuLayer}
          onClickOutside={() => setShow(false)}
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
        </Layer>
      )}
    </>
  );
};

const useStyles = createUseStyles({
  container: {},
  button: {
    ...floatingShadow,
  },
  mobileGameActionMenuLayer: {
    ...softBorderRadius,
    ...floatingShadow,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    width: '100%',

    justifyContent: 'center',
    alignItems: 'center',

    padding: `${spacers.default} 0 ${spacers.small}`,
  },
  gameActionButtonsContainer: {
    width: '70%',
    padding: spacers.default,
  },
});
