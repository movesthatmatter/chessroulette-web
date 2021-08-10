import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Layer } from 'grommet';
import { AppsRounded } from 'grommet-icons';
import { colors, floatingShadow, softBorderRadius } from 'src/theme';
import { RoomPlayActivityRecord } from 'dstnd-io';
import { Game } from 'src/modules/Games';
import { GameActions } from 'src/modules/Games/GameActions';
import { Text } from 'src/components/Text';
import { spacers } from 'src/theme/spacers';
import { roomPlayActivityParticipantToChessPlayer } from 'src/modules/Room/Activities/PlayActivity/util';
import {
  RoomPlayActivity,
  RoomPlayActivityWithGameAndParticipating,
} from 'src/modules/Room/Activities/PlayActivity';

type Props = {
  activity: RoomPlayActivityWithGameAndParticipating;
  // game: Game;
  // offer: RoomPlayActivityRecord['offer'];
  // players: NonNullable<RoomPlayActivity['participants']>;
};

export const MobileGameActionsWidget: React.FC<Props> = ({ activity }) => {
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
          {/* <GameActions
            isMobile={true}
            activity={activity}
            // players={{
            //   me: roomPlayActivityParticipantToChessPlayer(players.home),
            //   opponent: roomPlayActivityParticipantToChessPlayer(players.away),
            // }}
            // offer={offer}
            // game={game}
            onActionTaken={() => {
              setShow(false);
            }}
            className={cls.gameActionButtonsContainer}
          /> */}
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
