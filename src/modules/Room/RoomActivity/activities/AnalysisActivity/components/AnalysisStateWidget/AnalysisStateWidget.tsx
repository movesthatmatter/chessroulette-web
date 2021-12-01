import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import {
  analysis,
  ChessGameColor,
  ChessHistoryIndex,
  ChessHistoryMove,
  ChessPlayerBlack,
  ChessPlayerWhite,
  GameRecord,
} from 'dstnd-io';
import { FloatingBox } from 'src/components/FloatingBox';
import { ChessGameHistoryProvided } from 'src/modules/Games/Chess/components/GameHistory';
import { PlayerBox } from 'src/modules/Games/Chess/components/PlayerBox';
import { chessGameTimeLimitMsMap } from 'dstnd-io/dist/metadata/game';
import { toDictIndexedBy } from 'src/lib/util';
import { gameRecordToGame, getPlayerStats } from 'src/modules/Games/Chess/lib';
import { chessHistoryToSimplePgn, otherChessColor } from 'dstnd-io/dist/chessGame/util/util';
import { createUseStyles } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import { Text } from 'src/components/Text';
import { MiniClipboardCopyButton } from 'src/components/ClipboardCopy';
import { useGameTimesLeftByColorWithOptionalGame } from './hooks';

export type AnalysisStateWidgetProps = {
  displayedIndex: ChessHistoryIndex;
  gameAndPlayers?: {
    game: GameRecord;

    // TODO: This should be typed outside!
    players: {
      black: ChessPlayerBlack;
      white: ChessPlayerWhite;
    };
  };
  homeColor: ChessGameColor;
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
  gameAndPlayers?: AnalysisStateWidgetProps['gameAndPlayers']
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
      white: last2MovesByColor.white.clock,
      black: last2MovesByColor.black.clock,
    },
    stats: {
      white: getPlayerStats(gameSnapshot, players.white.user.id),
      black: getPlayerStats(gameSnapshot, players.black.user.id),
    },
    game,
  };
};

// Added a memo for now to optimize on the rerenders but this
//  is just a temporary patch until this is implemented:
// https://github.com/movesthatmatter/chessroulette-web/issues/149
export const AnalysisStateWidget: React.FC<AnalysisStateWidgetProps> = React.memo(
  ({
    displayedIndex,
    gameAndPlayers,
    homeColor,
    boxClassName,
    boxContainerClassName,
    historyBoxContentClassName,
  }) => {
    const cls = useStyles();
    const awayColor = otherChessColor(homeColor);

    const [playersGameInfo, setPlayersGameInfo] = useState(
      getPlayersGameInfo(displayedIndex, gameAndPlayers)
    );

    useEffect(() => {
      setPlayersGameInfo(getPlayersGameInfo(displayedIndex, gameAndPlayers));
    }, [displayedIndex, gameAndPlayers]);

    const timesLeft = useGameTimesLeftByColorWithOptionalGame(playersGameInfo?.game, [homeColor]);

    return (
      <>
        {playersGameInfo?.players[awayColor] && (
          <div className={cx(boxClassName, cls.playerInfoTop)}>
            <PlayerBox
              player={playersGameInfo.players[awayColor]}
              active={
                gameAndPlayers?.game.state === 'started' &&
                gameAndPlayers.game.lastMoveBy !== awayColor
              }
              material={playersGameInfo.stats[awayColor].materialScore}
              // TODO: This is 1Day Patch for relay
              gameTimeLimitClass="untimed"
              // {...(timesLeft && playersGameInfo.game.timeLimit !== 'untimed'
              //   ? {
              //       gameTimeLimitClass: playersGameInfo.game.timeLimit,
              //       timeLeft: timesLeft[awayColor],
              //     }
              //   : {
              //       gameTimeLimitClass: 'untimed',
              //     })}
            />
          </div>
        )}
        <div className={cx(boxClassName, boxContainerClassName)}>
          <FloatingBox className={cx(historyBoxContentClassName, cls.historyFloatingBox)}>
            <div className={cls.extra}>
              <ChessGameHistoryProvided />
            </div>

            <div style={{ display: 'flex', padding: spacers.small, flex: 1, height: '16px' }}>
              <div style={{ flex: 1 }} />
              <div style={{ display: 'flex' }}>
                <Text size="small2">PGN</Text>
                <MiniClipboardCopyButton value={'pgn'} className={cls.icon} />
              </div>
              <div style={{ width: spacers.small }} />
              <div style={{ display: 'flex' }}>
                <Text size="small2">FEN</Text>
                <MiniClipboardCopyButton value={'fen'} className={cls.icon} />
              </div>
            </div>
          </FloatingBox>
        </div>
        {playersGameInfo?.players[homeColor] && (
          <div className={cx(boxClassName, cls.playerInfoBottom)}>
            <PlayerBox
              player={playersGameInfo.players[homeColor]}
              active={
                gameAndPlayers?.game.state === 'started' &&
                gameAndPlayers.game.lastMoveBy !== homeColor
              }
              material={playersGameInfo.stats[homeColor].materialScore}
              // TODO: This is 1Day Patch for relay
              gameTimeLimitClass="untimed"
              // {...(timesLeft && playersGameInfo.game.timeLimit !== 'untimed'
              //   ? {
              //       gameTimeLimitClass: playersGameInfo.game.timeLimit,
              //       timeLeft: timesLeft[homeColor],
              //     }
              //   : {
              //       gameTimeLimitClass: 'untimed',
              //     })}
            />
          </div>
        )}
      </>
    );
  }
);

const useStyles = createUseStyles({
  extra: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100% - 16px)',
  },

  playerInfoTop: {
    marginBottom: spacers.small,
  },
  playerInfoBottom: {
    marginTop: spacers.small,
  },
  icon: {
    marginLeft: spacers.get(0.25),
  },
  historyFloatingBox: {},
});
