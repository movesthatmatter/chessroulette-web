import ndjsonStream from 'can-ndjson-stream';
import {
  acceptChallenge,
  declineChallenge,
  getBoardStreamById,
  getLichessStreamEvent,
  sendAChallenge,
  sendAMove,
} from '../resources';
import { LichessGameState, NDJsonReader, LichessGameFull, LichessChallenge } from '../types';
import { Pubsy } from 'src/lib/Pubsy';
import { parseUci, makeUci, makeSquare, parseSquare } from 'chessops/util';
import {
  ChessGameColor,
  ChessHistory,
  ChessMove,
  Err,
  GameSpecsRecord,
  Ok,
  RegisteredUserRecord,
} from 'dstnd-io';
import { NormalMove } from 'chessops/types';
import { getNewChessGame } from '../../Games/Chess/lib';
import { ShortMove } from 'chess.js';
import { Game } from '../../Games';
import { getHomeColor, lichessGameToChessRouletteGame, updateGameWithNewStateFromLichess } from '../utils';
import { chessGameTimeLimitMsMap } from 'dstnd-io/dist/metadata/game';
import { console } from 'window-or-global';
import { RegisteredUserRecordWithLichessConnection } from 'src/services/Authentication';

type LichessManagerEvents = {
  onStreamStart: undefined;
  onNewGame : {game:Game, homeColor: ChessGameColor};
  onGameFinish: { game: Game};
  onGameUpdate: {gameState: LichessGameState};
  onChallenge: { challenge: LichessChallenge };
  onChallengeAccepted: undefined;
};


export class LichessManager {
 // lichessGame?: LichessGameFull;
 // activityLog = Array<string>();
  auth : RequestInit = {};
  // userId? : string;
  // user?: RegisteredUserRecord;
  challengeId?:string;
  private pubsy = new Pubsy<LichessManagerEvents>();

  constructor(private user: RegisteredUserRecordWithLichessConnection) {
    this.auth = {
      headers : { Authorization: `Bearer ` + user.externalAccounts.lichess.accessToken }
    };
  }

  // init = (auth: NonNullable<RegisteredUserRecord>) => {
  //   this.auth = {
  //     headers : { Authorization: `Bearer ` + auth.externalAccounts?.lichess?.accessToken }
  //   };
  //   // this.userId = auth.externalAccounts?.lichess?.userId;
  //   this.user = auth;
  // }

  startStreamAndChallenge = (specs: GameSpecsRecord) => {
    console.log('START STREAM EVENT');
    getLichessStreamEvent(this.auth)
    .map((reader) => this.loopThroughNDJson(reader))
    .flatMap(() => {
      return sendAChallenge('tttcr', {
        ...this.auth,
        body: new URLSearchParams({
          'color': specs.preferredColor, 
          'clock.limit' : (chessGameTimeLimitMsMap[specs.timeLimit]/1000).toString(),
          'clock.increment' : '0'
        }),
      })
    })
    .mapErr(e => console.log('Error starting a stream', e.value));
  };

  private gameStart = (id: string) => {
    console.log('get board by id');
    getBoardStreamById(id, this.auth)
    .map(reader => this.loopThroughNDJson(reader))
    .mapErr(e => console.log('Error starting the game', e.value));
  };

  makeMove = (move: ChessMove, id: string) => {
    const normalMove: NormalMove = {
      from: parseSquare(move.from),
      to: parseSquare(move.to),
    };
    sendAMove(makeUci(normalMove), id, this.auth)
    .map(e => console.log('move successfull!'))
    .mapErr(e => console.log('move failed!'))
  };

  acceptChallenge = (challenge: LichessChallenge) => {
    acceptChallenge(challenge.id, this.auth)
    .map(reader => this.loopThroughNDJson(reader))
    .mapErr(e => console.log('error accepting a challenge', e.value))
  };

  declineChallenge = (challenge: LichessChallenge) => {
    declineChallenge(challenge.id, this.auth)
    .map((res) => this.loopThroughNDJson(res))
    .mapErr((e) => console.log('error declining a challenge', e.value));
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
        this.pubsy.publish( 'onNewGame', {
          homeColor: getHomeColor(event.value, this.user.externalAccounts.lichess.userId), 
          game: lichessGameToChessRouletteGame(event.value, this.user)
        })

       // this.lichessGame = event.value as LichessGameFull;
      }

      if (event.value.type === 'gameState') {
       // this.lichessGame.state = event.value as LichessGameState;
       this.pubsy.publish('onGameUpdate', {
         gameState: event.value as LichessGameState
       })
        if (event.value.winner) {
          //this.pubsy.publish('onGameFinish', { game: this.updateGame() });
        }
      }

      if (event.value.type === 'gameFinish') {
        console.log('FINSHED GAME!!!', event);
      }

      if (event.value.type === 'challenge') {
        this.pubsy.publish('onChallenge', { challenge: event.value.challenge as LichessChallenge });
        this.challengeId= event.value.challenge.id;
      }

      this.loopThroughNDJson(reader);

    } catch (e) {
      console.log('error parsing the current event', e);
    }
  }

  onStreamStart(fn : () => void) {
    this.pubsy.subscribe('onStreamStart', fn);
  }

  onChallengeAccepted(fn: () => void) {
    this.pubsy.subscribe('onChallengeAccepted', fn);
  }

  onChallenge(fn: (data: { challenge: LichessChallenge }) => void) {
    this.pubsy.subscribe('onChallenge', fn);
  }

  onGameFinished(fn: (data: { game: Game }) => void) {
    this.pubsy.subscribe('onGameFinish', fn);
  }

  onNewGame(fn: (data: {game: Game, homeColor: ChessGameColor}) => void){
    this.pubsy.subscribe('onNewGame', fn);
  }

  onGameUpdate(fn: (data : {gameState : LichessGameState}) => void) {
    this.pubsy.subscribe('onGameUpdate', fn);
  }
}

// export type LichessManagerType = LichessManager;

// let instance: LichessManager;
// export const getInstance = () => {
//   if (!instance) {
//     instance = new LichessManager();
//   }
//   return instance;
// };
