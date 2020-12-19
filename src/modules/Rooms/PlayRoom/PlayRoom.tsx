import { useWindowWidth } from '@react-hook/window-size';
import { ChessGameColor, ChessGameStatePgn, ChessMove } from 'dstnd-io';
import React, { useState } from 'react';
import { RoomWithPlayActivity } from 'src/components/RoomProvider';
import { createUseStyles } from 'src/lib/jss';
import { GameStateDialog } from 'src/modules/GameRoomV2/components/GameStateDialog';
import { getOppositePlayer, getPlayer, getPlayerColor } from 'src/modules/GameRoomV2/util';
import { useSoundEffects } from 'src/modules/Games/Chess';
import { otherChessColor } from 'src/modules/Games/Chess/util';
import { MOBILE_BREAKPOINT } from 'src/theme';
import { DesktopLayout, ChessGameHistory, MobileLayout } from './Layouts';

type Props = {
  room: RoomWithPlayActivity;
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
  onStatusCheck: () => void;
};

export const PlayRoom: React.FC<Props> = (props) => {
  const cls = useStyles();

  const windowWidth = useWindowWidth();

  const { game } = props.room.activity;

  useSoundEffects(game);

  

  // TODO: Get the whole state from the util function
  const myPlayer = getPlayer(props.room.me.user.id, game.players);
  const isMePlayer = !!myPlayer;
  const opponentPlayer = myPlayer
    ? getOppositePlayer(myPlayer, props.room.activity.game.players)
    : undefined;
  const homeColor = getPlayerColor(props.room.me.id, props.room.activity.game.players);
  const [gameDisplayedHistoryIndex, setGameDisplayedHistoryIndex] = useState(0);
  const canIPlay =
    isMePlayer && // I must be a player
    (game.state === 'pending' || game.state === 'started') && // game must be in playable mode
    (game.lastMoveBy ? game.lastMoveBy === otherChessColor(homeColor) : homeColor === 'white') && // It must be my turn
    gameDisplayedHistoryIndex === 0; // The most recent move must be displayed

  const content = () => {
    if (windowWidth <= MOBILE_BREAKPOINT) {
      return (
        <MobileLayout
          room={props.room}
          onMove={props.onMove}
          onAbort={props.onAbort}
          onOfferDraw={props.onOfferDraw}
          onRematchOffer={props.onRematchOffer}
          onResign={props.onResign}
          onTimerFinished={props.onTimerFinished}
          onHistoryIndexUpdated={() => {}}
          historyIndex={gameDisplayedHistoryIndex}
          homeColor={homeColor}
          canIPlay={canIPlay}
          opponentAsPlayer={opponentPlayer}
          meAsPlayer={myPlayer}
        />
      );
    }

    return (
      <DesktopLayout
        room={props.room}
        onMove={props.onMove}
        onAbort={props.onAbort}
        onOfferDraw={props.onOfferDraw}
        onRematchOffer={props.onRematchOffer}
        onResign={props.onResign}
        onTimerFinished={props.onTimerFinished}
        onHistoryIndexUpdated={() => {}}
        historyIndex={gameDisplayedHistoryIndex}
        homeColor={homeColor}
        canIPlay={canIPlay}
        opponentAsPlayer={opponentPlayer}
        meAsPlayer={myPlayer}
      />
    );
  };

  return (
    <>
      {content()}
      <GameStateDialog
        roomActivity={props.room.activity}
        onOfferCanceled={props.onOfferCanceled}
        onDrawAccepted={props.onDrawAccepted}
        onDrawDenied={props.onDrawDenied}
        onRematchAccepted={props.onRematchAccepted}
        onRematchDenied={props.onRematchDenied}
        myPlayer={myPlayer}
      />
    </>
  );
};

const useStyles = createUseStyles({
  container: {},
});
