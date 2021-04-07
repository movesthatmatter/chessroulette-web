import { ChessGameState, ChessPlayer } from 'dstnd-io';
import { Box } from 'grommet';

import React, { useRef } from 'react';
import { Avatar } from 'src/components/Avatar';
import { useContainerDimensions } from 'src/components/ContainerWithDimensions';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { floatingShadow, fonts, maxMediaQuery, minMediaQuery } from 'src/theme';
import { Countdown } from '../Countdown';

type Props = {
  player: ChessPlayer;
  timeLeft: ChessGameState['timeLeft']['black'] | ChessGameState['timeLeft']['white'];
  active: boolean;
  gameTimeLimit: ChessGameState['timeLimit'];
  material?: number;
  onTimerFinished?: () => void;
};

export const PlayerBox: React.FC<Props> = ({
  player,
  timeLeft,
  active,
  gameTimeLimit,
  material = 0,
  ...props
}) => {
  const cls = useStyles();

  return (
    <Box
      fill
      className={cls.container}
      direction='row'
    >
      <Box fill direction="row">
        <Avatar mutunachiId={Number(player.user.avatarId)} />
        <Box className={cls.playerInfo}>
          <Text className={cls.playerNameText}>{player.user.name}</Text>
          <div
            style={{
              flex: 1,
              display: 'flex',
            }}
          >
            <Text size="small1">{material > 0 && `+${material}`}</Text>
          </div>
        </Box>
      </Box>
      {gameTimeLimit !== 'untimed' && (
        <Countdown timeLeft={timeLeft} active={active} onFinished={props.onTimerFinished} />
      )}
    </Box>
  );
};

const useStyles = createUseStyles({
  container: {},
  playerInfo: {
    marginLeft: '8px',
  },
  avatar: {
    height: '32px',
    width: '32px',
    background: '#ddd',
    ...floatingShadow,
  },
  playerNameText: {
    ...fonts.small2,
  },
  piece: {
    marginRight: '3px',
  },
});
