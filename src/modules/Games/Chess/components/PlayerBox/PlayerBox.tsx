import React from 'react';
import { ChessGameState, ChessPlayer } from 'dstnd-io';
import { Box } from 'grommet';
import { Avatar } from 'src/components/Avatar';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { floatingShadow, fonts, LARGE_DESKTOP } from 'src/theme';
import { Countdown } from '../Countdown';
import { useWindowWidth } from '@react-hook/window-size';

type Props = {
  player: ChessPlayer;
  timeLeft: ChessGameState['timeLeft']['black'] | ChessGameState['timeLeft']['white'];
  active: boolean;
  gameTimeLimit: ChessGameState['timeLimit'];
  material?: number;
  onTimerFinished?: () => void;
  reverse? : boolean;
};

export const PlayerBox: React.FC<Props> = ({
  player,
  timeLeft,
  active,
  gameTimeLimit,
  material = 0,
  reverse = false,
  ...props
}) => {
  const cls = useStyles();
  const width = useWindowWidth();
  const isLargeDesktop = LARGE_DESKTOP < width;
  return (
    <Box fill className={cls.container} direction={isLargeDesktop? 'row' : reverse ? 'column-reverse' : 'column'}>
      <Box fill direction="row" style={{alignItems: 'center'}}>
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
        <Countdown
          timeLeft={timeLeft}
          active={active}
          onFinished={props.onTimerFinished}
          gameTimeClass={gameTimeLimit}
        />
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
