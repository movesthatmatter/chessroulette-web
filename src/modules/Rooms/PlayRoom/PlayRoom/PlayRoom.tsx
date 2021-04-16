import { useWindowWidth } from '@react-hook/window-size';
import { ChessGameColor, ChessGameStatePgn, ChessMove } from 'dstnd-io';
import React, { useState } from 'react';
import { RoomWithPlayActivity } from 'src/providers/PeerProvider';
import { GameStateDialog } from 'src/modules/Games/Chess/components/GameStateDialog';
import { useSoundEffects } from 'src/modules/Games/Chess';
import { MOBILE_BREAKPOINT } from 'src/theme';
import { DesktopLayout, ChessGameHistory, MobileLayout } from '../Layouts';
import { getPlayerStats } from 'src/modules/Games/Chess/lib';
import { Game } from 'src/modules/Games';
import { AwesomeLoader } from 'src/components/AwesomeLoader';
import { DialogContentProps } from 'src/components/Dialog';

type Props = {
  room: RoomWithPlayActivity;
  game: Game;
  onMove: (
    m: ChessMove,
    pgn: ChessGameStatePgn,
    history: ChessGameHistory,
    color: ChessGameColor
  ) => void;
  onResign: () => void;
  onAbort: () => void;
  onOfferDraw: () => void;
  onDrawAccepted: () => void;
  onDrawDenied: () => void;
  onRematchOffer: () => void;
  onRematchAccepted: () => void;
  onRematchDenied: () => void;
  onOfferCanceled: () => void;
  onTimerFinished: () => void;
  onGameStatusCheck: () => void;
};

const areBothPlayersJoined = ({ peersIncludingMe }: RoomWithPlayActivity, game: Game) => {
  const [playerA, playerB] = game.players;

  return playerA.user.id in peersIncludingMe && playerB.user.id in peersIncludingMe;
};

const canShowWaitingForOpponentNotification = (room: RoomWithPlayActivity, game: Game) => {
  const bothPlayersJoined = areBothPlayersJoined(room, game);

  return !bothPlayersJoined && game.state === 'pending';
}

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
  // TODO: This isn't really used yet!
  const [gameDisplayedHistoryIndex, setGameDisplayedHistoryIndex] = useState(0);

  // TODO: Need to make sure the given game has the same id as the activity game id

  useSoundEffects(game);

  const playerStats = getPlayerStats(game, props.room.me.id);
  const homeColor = playerStats.player?.color || 'white';

  const bothPlayersJoined = areBothPlayersJoined(props.room, game);
  const playable = bothPlayersJoined && playerStats.canPlay;

  const getWaitingForOpponentNotificationDialog = (p: { size?: number }): DialogContentProps => ({
    title: 'Waiting for opponent...',
    hasCloseButton: false,
    content: <AwesomeLoader sayings={sayings} size={p.size ? p.size / 4 : 50} />,
    buttons: [{
      label: 'Abort Game',
      type: 'secondary',
      onClick: () => props.onAbort(),
    }],
  });

  const getCurrentNotification = canShowWaitingForOpponentNotification(props.room, game)
    ? getWaitingForOpponentNotificationDialog
    : undefined;

  const content = () => {
    if (windowWidth <= MOBILE_BREAKPOINT) {
      return (
        <MobileLayout
          room={props.room}
          game={game}
          onMove={props.onMove}
          onAbort={props.onAbort}
          onOfferDraw={props.onOfferDraw}
          onRematchOffer={props.onRematchOffer}
          onResign={props.onResign}
          onTimerFinished={props.onTimerFinished}
          onHistoryIndexUpdated={() => {}}
          historyIndex={gameDisplayedHistoryIndex}
          homeColor={homeColor}
          playable={playable}
          opponentAsPlayer={playerStats.opponent}
          meAsPlayer={playerStats.player}
          gameNotificationDialog={getCurrentNotification}
        />
      );
    }

    return (
      <DesktopLayout
        room={props.room}
        game={game}
        onMove={props.onMove}
        onAbort={props.onAbort}
        onOfferDraw={props.onOfferDraw}
        onRematchOffer={props.onRematchOffer}
        onResign={props.onResign}
        onTimerFinished={props.onTimerFinished}
        onHistoryIndexUpdated={() => {}}
        historyIndex={gameDisplayedHistoryIndex}
        homeColor={homeColor}
        playable={playable}
        opponentAsPlayer={playerStats.opponent}
        meAsPlayer={playerStats.player}
        gameNotificationDialog={getCurrentNotification}
      />
    );
  };

  return (
    <>
      {content()}
      <GameStateDialog
        roomActivity={props.room.activity}
        game={game}
        onOfferCanceled={props.onOfferCanceled}
        onDrawAccepted={props.onDrawAccepted}
        onDrawDenied={props.onDrawDenied}
        onRematchAccepted={props.onRematchAccepted}
        onRematchDenied={props.onRematchDenied}
        myPlayer={playerStats.player}
      />
    </>
  );
};
