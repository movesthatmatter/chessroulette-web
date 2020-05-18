import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Mutunachi, MutunachiProps } from 'src/components/Mutunachi/Mutunachi';
import { ChessGameState, ChessPlayer } from 'src/modules/Games/Chess';
import { PeerConnectionStatus } from 'src/services/peers';
import cx from 'classnames';
import { Coundtdown } from '../Countdown';
import { TV } from '../TV/TV';

// / Normally this shouldn't be called when there is no game started
//  but it does get used when there is just me but for that I can mock it

type Props = {
  player: ChessPlayer;
  side: 'home' | 'away';
  streamConfig: PeerConnectionStatus['channels']['streaming'];
  currentGame: ChessGameState | undefined;
  avatarId: string;

  onTimeFinished: () => void;

  className?: string;
  muted?: boolean;
};

export const PlayerBox: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <div
      className={cx(cls.container, props.className, {
        [cls.containerReversed]: props.side === 'home',
      })}
    >
      <div className={cls.info}>
        <div className={cls.infoLeft}>
          <div className={cls.smallMutunachiWrapper}>
            <Mutunachi
              mid={props.avatarId}
              style={{ height: '50px' }}
            />
          </div>
          <div className={cls.playerDetailsWrapper}>
            <h4>{props.player.name}</h4>
            <div className={cls.playerDetails} />
          </div>
        </div>
        {props.currentGame && (
          <div
            className={cx(cls.countDownWrapper, {
              [cls.countDownWrapperReversed]: props.side === 'home',
            })}
          >
            <Coundtdown
              className={cls.countdown}
              timeLeft={props.currentGame.timeLeft?.[props.player.color] ?? 0}
              paused={
                !props.currentGame
                || props.currentGame.state !== 'started'
                || props.currentGame.lastMoved === props.player.color
              }
              onFinished={props.onTimeFinished}
              activeClassName={cx({
                [cls.activeCountdownTurn]:
                  props.currentGame
                  && props.currentGame.lastMoved !== props.player.color,
              })}
            />
          </div>
        )}
      </div>
      <div className={cls.tvWrapper}>
        <TV
          streamConfig={props.streamConfig}
          fallbackComponent={(
            <div className={cls.streamFallbackContainer}>
              <Mutunachi mid={props.avatarId} style={{ height: '250px' }} />
            </div>
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
    fontFamily: 'Open Sans',
  },
  containerReversed: {
    flexDirection: 'column-reverse',
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
  streamFallbackContainer: {
    textAlign: 'center',
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  info: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
  },
  infoLeft: {
    flex: 1,
    fontFamily: 'Roboto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallMutunachiWrapper: {
    flex: 0.2,
  },
  playerDetailsWrapper: {
    flex: 1,
    marginLeft: '10px',
  },
  playerDetails: {},
  countDownWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    display: 'flex',
    width: '80px',
    paddingBottom: '10px',
  },
  countDownWrapperReversed: {
    paddingBottom: '0px',
    paddingTop: '10px',
  },
  countdown: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Roboto',
    padding: '0 10px',

    backgroundColor: '#EFE7E8',
    borderRadius: '5px',
    boxShadow: '1px 1px 15px rgba(0, 0, 0, 0.24)',
  },
  activeCountdownTurn: {
    color: 'white',
    backgroundColor: 'rgb(247, 98, 123) !important',
    boxShadow: '1px 1px 15px rgba(20, 20, 20, 0.27)',
  },
});
