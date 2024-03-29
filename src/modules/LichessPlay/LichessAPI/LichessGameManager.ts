import {
  acceptChallenge,
  acceptOrOfferDraw,
  declineChallenge,
  declineDrawOffer,
  getBoardStreamById,
  getLichessStreamEvent,
  resignGame,
  sendAChallenge,
  sendAMessage,
  sendAMove,
} from '../resources';
import { LichessGameState, NDJsonReader, LichessChallenge, LichessChatLine } from '../types';
import { Pubsy } from 'src/lib/Pubsy';
import { makeUci, parseSquare } from 'chessops/util';
import { ChessGameColor, ChessMove, GameSpecsRecord } from 'chessroulette-io';
import { NormalMove } from 'chessops/types';
import { Game } from '../../Games';
import { getHomeColor, lichessGameToChessRouletteGame, getPromoPieceFromMove } from '../utils';
import { chessGameTimeLimitMsMap } from 'chessroulette-io/dist/metadata/game';
import { console } from 'window-or-global';
import { RegisteredUserRecordWithLichessConnection } from 'src/services/Authentication';

type LichessManagerEvents = {
  onStreamStart: undefined;
  onNewGame: { game: Game; homeColor: ChessGameColor };
  onGameFinish: undefined;
  onGameUpdate: { gameState: LichessGameState };
  onChallenge: { challenge: LichessChallenge };
  onChallengeAccepted: undefined;
  onNewChatLine: { chatLine: LichessChatLine };
};

export class LichessManager {
  auth: RequestInit = {};
  challengeId?: string;
  private pubsy = new Pubsy<LichessManagerEvents>();

  constructor(private user: RegisteredUserRecordWithLichessConnection) {
    this.auth = {
      headers: { Authorization: `Bearer ` + user.externalAccounts.lichess.accessToken },
    };
  }

  startStreamAndChallenge = (specs: GameSpecsRecord) => {
    getLichessStreamEvent(this.auth)
      .map((reader) => this.loopThroughNDJson(reader))
      .flatMap(() => {
        return sendAChallenge('tttcr', {
          ...this.auth,
          body: new URLSearchParams({
            ...(!!specs.preferredColor && {
              color: specs.preferredColor, // TODO: Changed on Dec 3rd. This might break now!
            }),
            'clock.limit': (chessGameTimeLimitMsMap[specs.timeLimit] / 1000).toString(),
            'clock.increment': '0',
          }),
        });
      })
      .mapErr((e) => console.log('Error starting a stream', e.value));
  };

  private gameStart = (id: string) => {
    getBoardStreamById(id, this.auth)
      .map((reader) => this.loopThroughNDJson(reader))
      .mapErr((e) => console.log('Error starting the game', e.value));
  };

  makeMove = (move: ChessMove, id: string) => {
    const normalMove: NormalMove = {
      from: parseSquare(move.from),
      to: parseSquare(move.to),
      ...(move.promotion && { promotion: getPromoPieceFromMove(move.promotion) }),
    };
    sendAMove(makeUci(normalMove), id, this.auth).mapErr((e) =>
      console.log('move failed!', e.error)
    );
  };

  sendChatMessage = (text: string, gameId: string) => {
    return sendAMessage(gameId, {
      ...this.auth,
      body: new URLSearchParams({
        room: 'player',
        text,
      }),
    })
      .mapErr((e) => console.log('failed to send a message'))
      .resolve();
  };

  resignGame = (gameId: string) => {
    resignGame(gameId, this.auth).mapErr((e) => console.log('failed to resign game'));
  };

  acceptOrOfferDraw = (gameId: string) => {
    return acceptOrOfferDraw(gameId, this.auth)
      .mapErr((e) => console.log('failed to resign game'))
      .resolve();
  };

  declineDraw = (gameId: string) => {
    return declineDrawOffer(gameId, this.auth)
      .mapErr((e) => console.log('failed to decline draw'))
      .resolve();
  };

  acceptChallenge = (challenge: LichessChallenge) => {
    acceptChallenge(challenge.id, this.auth).mapErr((e) =>
      console.log('error accepting a challenge', e)
    );
  };

  declineChallenge = (challenge: LichessChallenge) => {
    declineChallenge(challenge.id, this.auth).mapErr((e) =>
      console.log('error declining a challenge', e)
    );
  };

  private async loopThroughNDJson(reader: NDJsonReader) {
    try {
      const event = await reader.read();

      console.log('EVENT ', event);

      if (event.done && !event.value) {
        console.log('DONE DECODING STREAM');
        return;
      }

      if (event.value.type === 'gameStart') {
        //TODO - this would check if there's no game in Redux, just in case we get another GameFull event not to trigger it again!
        if (event.value.game.id === this.challengeId) {
          this.pubsy.publish('onChallengeAccepted', undefined);
        }
        this.gameStart(event.value['game']['id'] as string);
      }

      if (event.value.type === 'gameFull') {
        this.pubsy.publish('onNewGame', {
          homeColor: getHomeColor(event.value, this.user.externalAccounts.lichess.userId),
          game: lichessGameToChessRouletteGame(event.value, this.user),
        });
      }

      if (event.value.type === 'gameState') {
        this.pubsy.publish('onGameUpdate', {
          gameState: event.value as LichessGameState,
        });
        if (event.value.winner) {
          this.pubsy.publish('onGameFinish', undefined);
        }
      }

      if (event.value.type === 'chatLine') {
        this.pubsy.publish('onNewChatLine', { chatLine: event.value });
      }

      // if (event.value.type === 'gameFinish') {
      //   this.pubsy.publish('onGameFinish', undefined)
      // }

      if (event.value.type === 'challenge') {
        this.pubsy.publish('onChallenge', { challenge: event.value.challenge as LichessChallenge });
        this.challengeId = event.value.challenge.id;
      }

      this.loopThroughNDJson(reader);
    } catch (e) {
      console.log('error parsing the current event', e);
    }
  }

  onStreamStart(fn: () => void) {
    this.pubsy.subscribe('onStreamStart', fn);
  }

  onChallengeAccepted(fn: () => void) {
    this.pubsy.subscribe('onChallengeAccepted', fn);
  }

  onChallenge(fn: (data: { challenge: LichessChallenge }) => void) {
    this.pubsy.subscribe('onChallenge', fn);
  }

  onGameFinished(fn: () => void) {
    this.pubsy.subscribe('onGameFinish', fn);
  }

  onNewGame(fn: (data: { game: Game; homeColor: ChessGameColor }) => void) {
    this.pubsy.subscribe('onNewGame', fn);
  }

  onGameUpdate(fn: (data: { gameState: LichessGameState }) => void) {
    this.pubsy.subscribe('onGameUpdate', fn);
  }

  onNewChatLine(fn: (data: { chatLine: LichessChatLine }) => void) {
    this.pubsy.subscribe('onNewChatLine', fn);
  }
}
