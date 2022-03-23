import { WarGamePlayer, WarGameState } from 'dstnd-io';
import React from 'react';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { Countdown } from 'src/modules/Games/Chess/components/Countdown';
import { getUserDisplayName } from 'src/modules/User';
import { PeerAvatar } from 'src/providers/PeerConnectionProvider';
import { floatingShadow, fonts, onlyDesktop } from 'src/theme';

type Props = {
  player: WarGamePlayer;
  active: boolean;
  material?: number;
  onTimerFinished?: () => void;
  thumbnail?: boolean;
} & (
  | {
      gameTimeLimitClass: Exclude<WarGameState['timeLimit'], 'untimed'>;
      timeLeft: WarGameState['timeLeft']['black'] | WarGameState['timeLeft']['white'];
    }
  | {
      gameTimeLimitClass: Extract<WarGameState['timeLimit'], 'untimed'>;
      timeLeft?: number;
    }
);

export const WarGamePlayerBox: React.FC<Props> = ({
  player, active, material = 0, onTimerFinished, thumbnail, ...props
}) => {
  const cls = useStyles();

  return (
    <div className={cls.container} style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ display: 'flex', ...onlyDesktop({ justifyContent: 'center' }), flex: 1 }}>
        <PeerAvatar peerUserInfo={player.user} hasUserInfo />
        <div className={cls.playerInfo}>
          <Text className={cls.playerNameText}>{getUserDisplayName(player.user)}</Text>
          <div
            style={{
              flex: 1,
              display: 'flex',
            }}
          >
            <Text size="small1">{material > 0 && `+${material}`}</Text>
          </div>
        </div>
      </div>
      {props.gameTimeLimitClass !== 'untimed' && (
        <Countdown
          active={active}
          onFinished={onTimerFinished}
          timeLeft={props.timeLeft}
          gameTimeClass={props.gameTimeLimitClass}
          thumbnail={thumbnail}
        />
      )}
    </div>
  );
};

const useStyles = createUseStyles(theme => ({
  container: {
    color: theme.text.baseColor,
  },
  avatar: {
    height: '32px',
    width: '32px',
    background: '#ddd',
    ...floatingShadow,
  },
  playerInfo: {
    marginLeft: '8px',
  },
  playerNameText: {
    ...fonts.small2,
    wordBreak: 'break-all',
  },
}));