import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Layer } from 'grommet';
import { AppsRounded } from 'grommet-icons';
import { colors, floatingShadow, softBorderRadius } from 'src/theme';
import { ChessPlayer, RoomPlayActivityRecord } from 'dstnd-io';
import { Game } from 'src/modules/Games';
import { GameActions } from 'src/modules/Games/GameActions';
import { Text } from 'src/components/Text';
import { spacers } from 'src/theme/spacers';

type Props = {
  roomActivity: RoomPlayActivityRecord;
  game: Game;
  myPlayer: ChessPlayer;
};

export const MobileGameActionsWidget: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [show, setShow] = useState(false);

  return (
    <>
      <AppsRounded color={colors.white} onClick={() => setShow(true)} className={cls.button} />
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
            myPlayer={props.myPlayer}
            roomActivity={props.roomActivity}
            game={props.game}
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
