import { ChessPlayer } from 'dstnd-io';
import { Avatar, Box, Text } from 'grommet';
import React from 'react';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';
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
        <Avatar
          size="medium"
          round="large"
          margin={{
            right: 'small'
          }}
          className={cls.avatar}
        >
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