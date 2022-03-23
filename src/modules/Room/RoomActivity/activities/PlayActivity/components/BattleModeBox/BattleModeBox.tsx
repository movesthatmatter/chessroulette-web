import React, { useMemo, useState } from 'react';
import cx from 'classnames';
import { ChessGameColor, ChessHistoryMove, GameRecord } from 'chessroulette-io';
import { otherChessColor } from 'chessroulette-io/dist/chessGame/util/util';
import { FaceTime, MyFaceTime } from 'src/components/FaceTime';
import { createUseStyles } from 'src/lib/jss';
import { Game } from 'src/modules/Games';
import { PlayerBox } from 'src/modules/Games/Chess/components/PlayerBox';
import { onlyMobile, softBorderRadius } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { RoomPlayActivityWithGame } from '../../types';
import { chessGameTimeLimitMsMap } from 'chessroulette-io/dist/metadata/game';
import { toDictIndexedBy } from 'src/lib/util';
import { gameRecordToGame, getPlayerStats } from 'src/modules/Games/Chess/lib';
import { LayoutContainerDimensions } from 'src/modules/Room/Layouts';
import { Peer } from 'src/providers/PeerConnectionProvider';

type Props = {
  activity: RoomPlayActivityWithGame;
  homeColor: ChessGameColor;
  containerDimensions: LayoutContainerDimensions;
};

const AnyFaceTime: React.FC<{ peer: Peer }> = ({ peer }) => {
  if (peer.isMe) {
    return <MyFaceTime />;
  }

  return <FaceTime streamConfig={peer.connection.channels.streaming} />;
};

type TimeLeftMove = Pick<ChessHistoryMove, 'clock' | 'color'> & { san?: ChessHistoryMove['san'] };
const toTimeLeftMove = (m: ChessHistoryMove): TimeLeftMove => ({
  clock: m.clock,
  color: m.color,
  san: m.san,
});

// TODO: This is an exact copy of the GameDisplay component getPlayersGameInfo
//  which is a slight copy of Analysis
// TOOD: Consolidate all in one function!
const getPlayersGameInfo = (game: Game) => {
  // TODO: Check how this works with "untimed"
  const historyWithPadding: TimeLeftMove[] = [
    {
      clock: chessGameTimeLimitMsMap[game.timeLimit],
      color: 'white',
    },
    {
      clock: chessGameTimeLimitMsMap[game.timeLimit],
      color: 'black',
    },
  ];

  const history = game.history || [];
  const last2HalfMoves = [...historyWithPadding, ...history.map(toTimeLeftMove)].slice(-2);
  const last2MovesByColor = toDictIndexedBy(last2HalfMoves, (m) => m.color);

  const gameRecordSnapshot = {
    ...game,
    history,
  } as GameRecord;

  const gameSnapshot = gameRecordToGame(gameRecordSnapshot);

  const [homePlayer, awayPlayer] = game.players;

  return {
    players: {
      home: homePlayer,
      away: awayPlayer,
    },
    timeLeft: {
      home: last2MovesByColor[homePlayer.color].clock,
      away: last2MovesByColor[awayPlayer.color].clock,
    },
    stats: {
      home: getPlayerStats(gameSnapshot, homePlayer.user.id),
      away: getPlayerStats(gameSnapshot, awayPlayer.user.id),
    },
    game,
  } as const;
};

const facetimeSpacerPx = spacers.largerPx;
const facetimeSpacer = spacers.larger;

export const BattleModeBox: React.FC<Props> = ({ activity, homeColor, containerDimensions }) => {
  const cls = useStyles();
  const aspectRatio = useMemo(
    () =>
      ({
        width: containerDimensions.width - facetimeSpacerPx,
        height: (containerDimensions.height - facetimeSpacerPx) / 2,
      } as const),
    [containerDimensions]
  );

  const { awayPeer, homePeer } = useMemo(() => {
    const awayParticipant = activity.iamParticipating
      ? activity.participants.opponent
      : activity.participants[otherChessColor(homeColor)];

    const homeParticipant = activity.iamParticipating
      ? activity.participants.me
      : activity.participants[homeColor];

    return {
      awayPeer: awayParticipant.participant.isPresent
        ? awayParticipant.participant.member.peer
        : undefined,
      homePeer: homeParticipant.participant.isPresent
        ? homeParticipant.participant.member.peer
        : undefined,
    };
  }, [activity.iamParticipating, activity.participants]);

  const awayColor = otherChessColor(homeColor);
  const [playersGameInfo, setPlayersGameInfo] = useState(getPlayersGameInfo(activity.game));

  return (
    <div className={cls.container}>
      {awayPeer && (
        <MyFaceTime
          className={cls.faceTime}
          aspectRatio={aspectRatio}
          footerOverlay={
            <>
              <div className={cls.playerInfoBox}>
                <PlayerBox
                  player={playersGameInfo.players.away}
                  timeLeft={playersGameInfo.timeLeft.away}
                  active={
                    activity.game.state === 'started' && activity.game.lastMoveBy === homeColor
                  }
                  gameTimeLimitClass={playersGameInfo.game.timeLimit}
                  material={playersGameInfo.stats.away.materialScore}
                />
              </div>
              <div className={cls.playerBoxGradient} />
            </>
          }
        />
      )}
      {homePeer && (
        <MyFaceTime
          className={cls.faceTime}
          aspectRatio={aspectRatio}
          headerOverlay={
            <>
              <div className={cls.playerInfoBox}>
                <PlayerBox
                  player={playersGameInfo.players.home}
                  timeLeft={playersGameInfo.timeLeft.home}
                  active={
                    activity.game.state === 'started' && activity.game.lastMoveBy === awayColor
                  }
                  gameTimeLimitClass={playersGameInfo.game.timeLimit}
                  material={playersGameInfo.stats.home.materialScore}
                />
              </div>
              <div className={cx(cls.playerBoxGradient, cls.playerBoxGradientTop)} />
            </>
          }
        />
      )}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingRight: facetimeSpacer,
  },
  faceTime: {
    ...softBorderRadius,
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
  },
  peerInfoWrapper: {
    ...onlyMobile({
      flexDirection: 'column',
      justifyContent: 'flex-end',
    }),
    flex: 1,
    display: 'flex',
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    padding: spacers.get(0.7),
    position: 'relative',
  },
  playerInfoBox: {
    padding: spacers.small,
    position: 'relative',
    zIndex: 99,
    overflow: 'hidden',
  },
  playerBoxGradient: {
    background: 'linear-gradient(0deg, rgba(0, 0, 0, .8) 0%, rgba(0, 0, 0, 0) 100%)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '30%',
    zIndex: 98,
    ...softBorderRadius,
  },
  playerBoxGradientTop: {
    background: 'linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .8) 100%)',
    top: 0,
    bottom: 'auto',
  },
});
