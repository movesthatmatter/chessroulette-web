import useInstance from '@use-it/instance';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Pubsy } from 'src/lib/Pubsy';
import { Game } from 'src/modules/Games';
import { selectGame } from 'src/modules/Room/RoomActivity/redux/selectors';
import { usePeerState } from 'src/providers/PeerProvider';
import { SocketClient } from 'src/services/socket/SocketClient';
import { console } from 'window-or-global';
import { useLichessProvider } from '../../LichessProvider/hooks/useLichessProvider';
import { LichessPlayer } from '../../types';
import { lichessGameActionsPayloads } from '../../payloads';

type Events = {
  onGameUpdate: Game;
};

export const useLichessGameActions = () => {
  const peerState = usePeerState();
  const pubsy = useInstance<Pubsy<Events>>(new Pubsy<Events>());
  const lichess = useLichessProvider();
  const game = useSelector(selectGame);

  const request: SocketClient['send'] = (payload) => {
    if (peerState.status === 'open') {
      peerState.client.sendMessage(payload);
    }
  };

  return {
    onStatusCheck : () => {
      request({
        kind: 'gameStatusCheckRequest',
        content: undefined,
      })
    },
    onJoinedGame: (game: Game, player: LichessPlayer) => {
      request(lichessGameActionsPayloads.onGameJoined(game, player));
      pubsy.publish('onGameUpdate', game);
    },
    onUpdateGame: (game: Game) => {
      request(lichessGameActionsPayloads.onGameUpdated(game));
      pubsy.publish('onGameUpdate', game);
    },
    onGameUpdatedEventListener: (fn: (g: Game) => void) => pubsy.subscribe('onGameUpdate', fn),
    onDrawAccept: () => {
      if (lichess && game) {
        lichess.acceptDraw(game.vendorData?.gameId as string);
      }
    },
    resignGame: () => {
      if (lichess && game) {
        lichess.resignGame(game.vendorData?.gameId as string);
      }
    },
    onDrawDecline: () => {
      if (lichess && game) {
        lichess.declineDraw(game.vendorData?.gameId as string);
      }
    },
    sendDrawOffer: () => {
      if (lichess && game) {
        console.log('sending draw offer! ');
        lichess.sendDrawOffer(game.vendorData?.gameId as string);
      }
    },
    onTakebackAccept: () => {
      if (lichess && game) {
        lichess.acceptTakeback(game.vendorData?.gameId as string);
      }
    },
    onTakebackDecline: () => {
      if (lichess && game) {
        lichess.declineTakeback(game.vendorData?.gameId as string);
      }
    },
    sendTakebackOffer: () => {
      if (lichess && game) {
        lichess.sendTakebackOffer(game.vendorData?.gameId as string);
      }
    },
    acceptRematch: () => {
      if (lichess) {
        lichess.onRematchAccept();
      }
    },
    denyRematch: () => {
      if (lichess) {
        lichess.onRematchDeny();
      }
    },
  };
};
