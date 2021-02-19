import { useWindowWidth } from '@react-hook/window-size';
import { ChessGameColor, ChessGameStatePgn, ChessMove, GameRecord } from 'dstnd-io';
import React, { useState } from 'react';
import { RoomWithPlayActivity } from 'src/providers/PeerProvider';
import { GameStateDialog } from 'src/modules/Games/Chess/components/GameStateDialog';
import { useSoundEffects } from 'src/modules/Games/Chess';
import { MOBILE_BREAKPOINT } from 'src/theme';
import { DesktopLayout, ChessGameHistory, MobileLayout } from '../Layouts';
import { getPlayerStats } from 'src/modules/Games/Chess/lib';

type Props = {
  room: RoomWithPlayActivity;
  game: GameRecord;
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

export const PlayRoom: React.FC<Props> = ({ game, ...props }) => {
  const windowWidth = useWindowWidth();
  // TODO: This isn't really used yet!
  const [gameDisplayedHistoryIndex, setGameDisplayedHistoryIndex] = useState(0);

  // TODO: Need to make sure the given game has the same id as the activity game id

  useSoundEffects(game);

  const playerStats = getPlayerStats(game, props.room.me.id);
  const homeColor = playerStats.player?.color || 'white';

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
          canIPlay={playerStats.canPlay}
          opponentAsPlayer={playerStats.opponent}
          meAsPlayer={playerStats.player}
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
        canIPlay={playerStats.canPlay}
        opponentAsPlayer={playerStats.opponent}
        meAsPlayer={playerStats.player}
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
