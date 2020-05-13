import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Mutunachi, MutunachiProps } from 'src/components/Mutunachi/Mutunachi';
import { ChessGameState, ChessPlayer } from 'src/modules/Games/Chess';
import { PeerConnectionStatus } from 'src/services/peers';
import cx from 'classnames';
import { useWindowSize } from '@react-hook/window-size';
import { Coundtdown } from '../Countdown';
import { getBoardSize } from '../../util';
import { TV } from '../TV/TV';

// / Normally this shouldn't be called when there is no game started
//  but it does get used when there is just me but for that I can mock it

type Props = {
  player: ChessPlayer;
  side: 'home' | 'away';
  streamConfig: PeerConnectionStatus['channels']['streaming'];
  currentGame: ChessGameState;
  mutunachiId: MutunachiProps['mid'];

  className?: string;
  muted?: boolean;
};

export const PlayerBox: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [screenWidth, screenHeight] = useWindowSize();

  const boardSize = getBoardSize({ screenWidth, screenHeight });

  return (
    <div
      style={{ width: boardSize / 2 }}
      className={cx(cls.container, props.className, {
        [cls.containerReversed]: props.side === 'home',
      })}
    >
      <div className={cls.info}>
        <div className={cls.infoLeft}>
          <h4>{props.player.name}</h4>
        </div>
        {props.currentGame && (
          <Coundtdown
            className={cls.countdown}
            timeLeft={props.currentGame.timeLeft?.[props.player.color] ?? 0}
            paused={!props.currentGame || (props.currentGame.lastMoved === props.player.color)}
            activeClassName={cx({
              [cls.activeTurn]: props.currentGame && (
                props.currentGame.lastMoved !== props.player.color
              ),
            })}
          />
        )}
      </div>
      <div className={cls.tvWrapper}>
        <TV
          width={boardSize / 2}
          streamConfig={props.streamConfig}
          fallbackComponent={(
            <Mutunachi
              mid={props.mutunachiId}
              className={cls.mutunachi}
            />
          )}
          muted={props.muted}
        />
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    width: '100%',
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'column',
  },
  containerReversed: {
    flexDirection: 'column-reverse',
  },

  activeTurn: {
    background: 'yellow',
  },
  tv: {
    background: 'grey',
    flex: 1,
    display: 'flex',
  },
  tvReversed: {
    background: 'green',
    alignContent: 'flex-end',
    flexDirection: 'column',
  },
  tvWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  mutunachi: {
    width: '40p%',
    maxWidth: '150px',
    textAlign: 'center',
  },
  info: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
  },
  infoLeft: {
    flex: 1,
  },
  countdown: {
    width: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
