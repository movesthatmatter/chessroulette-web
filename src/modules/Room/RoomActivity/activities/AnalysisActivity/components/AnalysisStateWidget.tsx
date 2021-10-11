import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import {
  analysis,
  ChessHistoryIndex,
  ChessHistoryMove,
  ChessPlayer,
  GameRecord,
} from 'dstnd-io';
import { FloatingBox } from 'src/components/FloatingBox';
import { ChessGameHistoryProvided } from 'src/modules/Games/Chess/components/GameHistory';
import { PlayerBox } from 'src/modules/Games/Chess/components/PlayerBox';
import { chessGameTimeLimitMsMap } from 'dstnd-io/dist/metadata/game';
import { toDictIndexedBy } from 'src/lib/util';
import { gameRecordToGame, getPlayerStats } from 'src/modules/Games/Chess/lib';
import { chessHistoryToSimplePgn } from 'dstnd-io/dist/chessGame/util/util';
import { createUseStyles } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';

type Props = {
  displayedIndex: ChessHistoryIndex;
  gameAndPlayers?: {
    game: GameRecord;
    players: {
      home: ChessPlayer;
      away: ChessPlayer;
    };
  };
  boxClassName: string;
  boxContainerClassName: string;
  historyBoxContentClassName: string;
};

type TimeLeftMove = Pick<ChessHistoryMove, 'clock' | 'color'> & { san?: ChessHistoryMove['san'] };
const toTimeLeftMove = (m: ChessHistoryMove): TimeLeftMove => ({
  clock: m.clock,
  color: m.color,
  san: m.san,
});

const getPlayersGameInfo = (
  displayedIndex: ChessHistoryIndex,
  gameAndPlayers?: Props['gameAndPlayers']
) => {
  // If we don't have the game, players or the game history don't do anything
  if (!gameAndPlayers) {
    return undefined;
  }

  const { game, players } = gameAndPlayers;
  const rootHistoryIndex = analysis.actions.getRootChessHistoryIndex(displayedIndex);

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
  const slicedHistory = history.slice(0, rootHistoryIndex + 1);

  const last2HalfMoves = [...historyWithPadding, ...slicedHistory.map(toTimeLeftMove)].slice(-2);
  const last2MovesByColor = toDictIndexedBy(last2HalfMoves, (m) => m.color);

  const gameRecordSnapshot = {
    ...game,
    history: slicedHistory,
    pgn: chessHistoryToSimplePgn(slicedHistory),
  } as GameRecord;

  const gameSnapshot = gameRecordToGame(gameRecordSnapshot);

  return {
    players,
    timeLeft: {
      away: last2MovesByColor[players.away.color].clock,
      home: last2MovesByColor[players.home.color].clock,
    },
    stats: {
      away: getPlayerStats(gameSnapshot, players.away.user.id),
      home: getPlayerStats(gameSnapshot, players.home.user.id),
    },
    game,
  };
};

export const AnalysisStateWidget: React.FC<Props> = ({
  displayedIndex,
  gameAndPlayers,
  boxClassName,
  boxContainerClassName,
  historyBoxContentClassName,
}) => {
  const cls = useStyles();

  const [playersGameInfo, setPlayersGameInfo] = useState(
    getPlayersGameInfo(displayedIndex, gameAndPlayers)
  );

  useEffect(() => {
    setPlayersGameInfo(getPlayersGameInfo(displayedIndex, gameAndPlayers));
  }, [displayedIndex, gameAndPlayers]);

  return (
    <>
      {playersGameInfo?.players.away && (
        <div className={cx(boxClassName, cls.playerInfoTop)}>
          <PlayerBox
            player={playersGameInfo.players.away}
            timeLeft={playersGameInfo.timeLeft.away}
            active={false}
            gameTimeLimit={playersGameInfo.game.timeLimit}
            material={playersGameInfo.stats.away.materialScore}
          />
        </div>
      )}
      <div className={cx(boxClassName, boxContainerClassName)}>
        <FloatingBox className={historyBoxContentClassName}>
          <ChessGameHistoryProvided />
        </FloatingBox>
      </div>
      {playersGameInfo?.players.home && (
        <div className={cx(boxClassName, cls.playerInfoBottom)}>
          <PlayerBox
            player={playersGameInfo.players.home}
            timeLeft={playersGameInfo.timeLeft.home}
            active={false}
            gameTimeLimit={playersGameInfo.game.timeLimit}
            material={playersGameInfo.stats.home.materialScore}
          />
        </div>
      )}
    </>
  );
};

const useStyles = createUseStyles({
  playerInfoTop: {
    marginBottom: spacers.small,
  },
  playerInfoBottom: {
    marginTop: spacers.small,
  },
});