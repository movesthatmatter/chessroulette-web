import { ChessHistoryMove, GameRecord } from 'dstnd-io';
import { chessGameTimeLimitMsMap } from 'dstnd-io/dist/metadata/game';
import React, { useEffect, useState } from 'react';
import { ContainerWithDimensions } from 'src/components/ContainerWithDimensions';
import { createUseStyles } from 'src/lib/jss';
import { noop, toDictIndexedBy } from 'src/lib/util';
import { ChessBoard } from '../../Chess/components/ChessBoard';
import { PlayerBox } from '../../Chess/components/PlayerBox';
import { gameRecordToGame, getPlayerStats } from '../../Chess/lib';
import { Game } from '../../types';
import cx from 'classnames';
import { spacers } from 'src/theme/spacers';

type Props = {
  game: Game;
  className?: string;
  boxClassName?: string;
};

type TimeLeftMove = Pick<ChessHistoryMove, 'clock' | 'color'> & { san?: ChessHistoryMove['san'] };
const toTimeLeftMove = (m: ChessHistoryMove): TimeLeftMove => ({
  clock: m.clock,
  color: m.color,
  san: m.san,
});

// TODO: This is a slight copy of AnalysisStateWidget
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

export const ChessGameDisplay: React.FC<Props> = ({ game, className, boxClassName }) => {
  const cls = useStyles();

  const [playersGameInfo, setPlayersGameInfo] = useState(getPlayersGameInfo(game));

  useEffect(() => {
    setPlayersGameInfo(getPlayersGameInfo(game));
  }, [game]);

  return (
    <div className={cls.container}>
      <ContainerWithDimensions
        render={(d) => (
          <>
            <div className={cx(boxClassName, cls.playerInfoTop)}>
              <PlayerBox
                player={playersGameInfo.players.away}
                timeLeft={playersGameInfo.timeLeft.away}
                active={false}
                gameTimeLimit={playersGameInfo.game.timeLimit}
                material={playersGameInfo.stats.away.materialScore}
              />
            </div>
            <ChessBoard
              size={d.width}
              id={game.id}
              pgn={game.pgn}
              type="play"
              onMove={noop}
              canInteract={false}
              playable={false}
              playableColor={playersGameInfo.players.home.color}
              coordinates={false}
              className={className}
              viewOnly
            />
            <div className={cx(boxClassName, cls.playerInfoBottom)}>
              <PlayerBox
                player={playersGameInfo.players.home}
                timeLeft={playersGameInfo.timeLeft.home}
                active={false}
                gameTimeLimit={playersGameInfo.game.timeLimit}
                material={playersGameInfo.stats.home.materialScore}
              />
            </div>
          </>
        )}
      />
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
  playerInfoTop: {
    marginBottom: spacers.small,
  },
  playerInfoBottom: {
    marginTop: spacers.small,
  },
});
