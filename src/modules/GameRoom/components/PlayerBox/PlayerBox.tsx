import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { FaceTime } from 'src/components/FaceTimeArea/FaceTime';
import { Mutunachi, MutunachiProps } from 'src/components/Mutunachi/Mutunachi';
import { ChessGameState, ChessPlayer } from 'src/modules/Games/Chess';
import { PeerConnectionStatus } from 'src/services/peers';
import cx from 'classnames';
import { Coundtdown } from '../Countdown';

// / Normally this shouldn't be called when there is no game started
//  but it does get used when there is just me but for that I can mock it

type Props = {
  player: ChessPlayer;
  side: 'home' | 'away';
  streamConfig: PeerConnectionStatus['channels']['streaming'];
  currentGame: ChessGameState;
  mutunachiId: MutunachiProps['mid'];

  className?: string;
};

export const PlayerBox: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <div className={cx(cls.container, props.className)}>
      {props.streamConfig.on ? (
        <div className={cls.facetime}>
          <FaceTime streamConfig={props.streamConfig} />
        </div>
      ) : (
        <Mutunachi
          mid={props.mutunachiId}
          className={cls.mutunachi}
        />
      )}
      <div>
        {props.currentGame && (
          <>
            <Coundtdown
              timeLeft={props.currentGame.timeLeft?.[props.player.color] ?? 0}
              paused={!props.currentGame || (props.currentGame.lastMoved === props.player.color)}
            />
            <h4>{props.player.name}</h4>
          </>
        )}
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'block',
    width: '100%',
    // width: '50%',
    // order: 3,
    // flex: 1,
    textAlign: 'right',
  },
  facetime: {
    // paddingTop: '16px',
    // '&:first-child': {
    //   paddingTop: '0px',
    // },
    // width: 10
    maxWidth: '320px',
    // maxHeight: '50%',

    display: 'flex',
    margin: '0 0 0 auto',
    // alignItems: 'flex-end',
    // justifyContent: 'flex-end',
    // justifyItems: 'flex-end',
    // textAlign: 'center',
    // margin: '0 auto',
    // background: 'green',
  },
  mutunachi: {
    width: '40p%',
    textAlign: 'center',
  },
});
