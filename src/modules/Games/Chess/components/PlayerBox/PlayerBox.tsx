import React from 'react';
import { ChessGameState, ChessPlayer } from 'dstnd-io';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { floatingShadow, fonts, onlyDesktop } from 'src/theme';
import { Countdown } from '../Countdown';
import { PeerAvatar } from 'src/providers/PeerProvider/components/PeerAvatar';
import { getUserDisplayName } from 'src/modules/User';

type Props = {
  player: ChessPlayer;
  active: boolean;
  material?: number;
  onTimerFinished?: () => void;
  thumbnail?: boolean;
} & (
  | {
      gameTimeLimitClass: Exclude<ChessGameState['timeLimit'], 'untimed'>;
      timeLeft: ChessGameState['timeLeft']['black'] | ChessGameState['timeLeft']['white'];
    }
  | {
      gameTimeLimitClass: Extract<ChessGameState['timeLimit'], 'untimed'>;
      timeLeft?: number;
    }
);

export const PlayerBox: React.FC<Props> = ({ player, active, material = 0, ...props }) => {
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
          onFinished={props.onTimerFinished}
          timeLeft={props.timeLeft}
          gameTimeClass={props.gameTimeLimitClass}
          thumbnail={props.thumbnail}
        />
      )}
    </div>
  );
};

const useStyles = createUseStyles((theme) => ({
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
