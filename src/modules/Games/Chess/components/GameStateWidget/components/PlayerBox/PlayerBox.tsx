import { ChessPlayer } from 'dstnd-io';
import { Box } from 'grommet';

import React from 'react';
import { Avatar } from 'src/components/Avatar';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { ChessGameState } from 'src/modules/Games/Chess/records';
import { floatingShadow, fonts } from 'src/theme';
import { Coundtdown } from '../Countdown';

type Props = {
  player: ChessPlayer;
  timeLeft: ChessGameState['timeLeft']['black'] | ChessGameState['timeLeft']['white'];
  active: boolean,
};

export const PlayerBox: React.FC<Props> = ({
  player,
  timeLeft,
  active,
}) => {
  const cls = useStyles();

  return (
    <Box fill className={cls.container} direction="row">
      <Box className={cls.playerInfo} fill direction="row">
        <Avatar>
          <Mutunachi mid={player.user.avatarId} />
        </Avatar>
        <Text className={cls.playerNameText}>
          {player.user.name}
        </Text>
      </Box>
      <Coundtdown
        timeLeft={timeLeft}
        active={active}
      />
    </Box>
  );
};

const useStyles = createUseStyles({
  container: {},
  playerInfo: {},
  avatar: {
    height: '32px',
    width: '32px',
    background: '#ddd',
    ...floatingShadow,
  },
  playerNameText: {
    ...fonts.small2,
  }
});