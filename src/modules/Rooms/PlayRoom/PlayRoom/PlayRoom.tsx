import React, { useState, useEffect } from 'react';
import { RoomWithPlayActivity } from 'src/providers/PeerProvider';
import { getPlayerStats } from 'src/modules/Games/Chess/lib';
import { Game } from 'src/modules/Games';
import { chessHistoryToSimplePgn } from 'dstnd-io/dist/chessGame/util/util';
import { PlayRoomMobile } from './PlayRoomMobile';
import { PlayRoomDesktop } from './PlayRoomDesktop';
import { useRoomNotificationListener } from 'src/modules/ActivityLog/useRoomNotificationListener';
import { GameStateDialogProvider } from 'src/modules/Games/components/GameStateDialog';
import { useDeviceSize } from 'src/theme/hooks/useDeviceSize';

type Props = {
  room: RoomWithPlayActivity;
  game: Game;
};

const areBothPlayersJoined = ({ peersIncludingMe }: RoomWithPlayActivity, game: Game) => {
  const [playerA, playerB] = game.players;

  return playerA.user.id in peersIncludingMe && playerB.user.id in peersIncludingMe;
};

export const PlayRoom: React.FC<Props> = ({ game, ...props }) => {
  const [gameDisplayedHistoryIndex, setGameDisplayedHistoryIndex] = useState(0);
  const [displayedPgn, setDisplayedPgn] = useState<Game['pgn']>();
  const deviceSize = useDeviceSize();

  useEffect(() => {
    if (!game.history || game.history.length === 0 || gameDisplayedHistoryIndex === 0) {
      setDisplayedPgn(undefined);
      return;
    }

    const nextPgn = chessHistoryToSimplePgn(game.history.slice(0, -gameDisplayedHistoryIndex));

    setDisplayedPgn(nextPgn);
  }, [game, gameDisplayedHistoryIndex]);

  useEffect(() => {
    // Reset the displayed if the game updates!
    setGameDisplayedHistoryIndex(0);
  }, [game]);

  useRoomNotificationListener(game);

  // TODO: Need to make sure the given game has the same id as the activity game id
  const playerStats = getPlayerStats(game, props.room.me.id);
  const homeColor = playerStats.player?.color || 'white';
  const bothPlayersJoined = areBothPlayersJoined(props.room, game);
  const playable = bothPlayersJoined && playerStats.canPlay;

  return (
    <GameStateDialogProvider
      room={props.room}
      game={game}
      myPlayer={playerStats.player}
      isMobile={deviceSize.isMobile}
    >
      {deviceSize.isMobile ? (
        <PlayRoomMobile
          room={props.room}
          game={game}
          onHistoryIndexUpdated={setGameDisplayedHistoryIndex}
          historyIndex={gameDisplayedHistoryIndex}
          displayedPgn={displayedPgn}
          homeColor={homeColor}
          playable={playable}
          opponentAsPlayer={playerStats.opponent}
          meAsPlayer={playerStats.player}
        />
      ) : (
        <PlayRoomDesktop
          room={props.room}
          game={game}
          onHistoryIndexUpdated={setGameDisplayedHistoryIndex}
          historyIndex={gameDisplayedHistoryIndex}
          displayedPgn={displayedPgn}
          homeColor={homeColor}
          playable={playable}
          opponentAsPlayer={playerStats.opponent}
          meAsPlayer={playerStats.player}
        />
      )}
    </GameStateDialogProvider>
  );
};
