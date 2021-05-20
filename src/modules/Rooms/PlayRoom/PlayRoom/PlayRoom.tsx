import React, { useState, useEffect } from 'react';
import { useWindowWidth } from '@react-hook/window-size';
import { RoomWithPlayActivity } from 'src/providers/PeerProvider';
import { MOBILE_BREAKPOINT } from 'src/theme';
import { getPlayerStats } from 'src/modules/Games/Chess/lib';
import { Game } from 'src/modules/Games';
import { AwesomeLoader } from 'src/components/AwesomeLoader';
import { DialogContentProps } from 'src/components/Dialog';
import { chessHistoryToSimplePgn } from 'dstnd-io/dist/chessGame/util/util';
import { PlayRoomMobile } from './PlayRoomMobile';
import { PlayRoomDesktop } from './PlayRoomDesktop';
import { useGameActions } from 'src/modules/Games/GameActions';
import { useRoomNotificationListener } from 'src/modules/ActivityLog/useRoomNotificationListener';

type Props = {
  room: RoomWithPlayActivity;
  game: Game;
};

const areBothPlayersJoined = ({ peersIncludingMe }: RoomWithPlayActivity, game: Game) => {
  const [playerA, playerB] = game.players;

  return playerA.user.id in peersIncludingMe && playerB.user.id in peersIncludingMe;
};

const canShowWaitingForOpponentNotification = (room: RoomWithPlayActivity, game: Game) => {
  const bothPlayersJoined = areBothPlayersJoined(room, game);

  return !bothPlayersJoined && game.state === 'pending';
};

const sayings = [
  'Loading...',
  'Your opponent is just getting ready',
  `Let's hope your friend is not scared of a challenge`,
  'Establishing connection...',
  `Patience is a virtue.. I guess`,
  `Get ready, your friend is on the way.`,
  `Still time to polish your chess`,
];

export const PlayRoom: React.FC<Props> = ({ game, ...props }) => {
  const windowWidth = useWindowWidth();
  const [gameDisplayedHistoryIndex, setGameDisplayedHistoryIndex] = useState(0);
  const [displayedPgn, setDisplayedPgn] = useState<Game['pgn']>();
  const gameActions = useGameActions();

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

  const getWaitingForOpponentNotificationDialog = (p: { size?: number }): DialogContentProps => ({
    title: 'Waiting for opponent...',
    hasCloseButton: false,
    content: <AwesomeLoader sayings={sayings} size={p.size ? p.size / 4 : 50} />,
    buttons: [
      {
        label: 'Abort Game',
        type: 'secondary',
        onClick: () => gameActions.onAbort(),
      },
    ],
  });

  const getCurrentNotification = canShowWaitingForOpponentNotification(props.room, game)
    ? getWaitingForOpponentNotificationDialog
    : undefined;

  if (windowWidth <= MOBILE_BREAKPOINT) {
    return (
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
        gameNotificationDialog={getCurrentNotification}
      />
    );
  }

  return (
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
      gameNotificationDialog={getCurrentNotification}
    />
  );
};
