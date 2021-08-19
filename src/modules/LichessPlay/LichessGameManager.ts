import ndjsonStream from 'can-ndjson-stream';
import {
  acceptChallenge,
  declineChallenge,
  getBoardStreamById,
  getLichessStreamEvent,
  sendAChallenge,
  sendAMove,
} from './resources';
import { LichessGameState, NDJsonReader, LichessGameFull, LichessChallenge } from './types';
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
import { getNewChessGame } from '../Games/Chess/lib';
import { ShortMove } from 'chess.js';
import { Game } from '../Games';
import { getHomeColor, lichessStateToGame } from './utils';
import { chessGameTimeLimitMsMap } from 'dstnd-io/dist/metadata/game';
import { console } from 'window-or-global';

type LichessManagerEvents = {
  onStreamStart: undefined;
  onGameFinish: { game: Game };
  onGameUpdate: {game: LichessGameFull, gameHistory: ChessHistory};
  onChallenge: { challenge: LichessChallenge };
  onChallengeAccepted: undefined;
};

export class LichessManager {
  lichessGame?: LichessGameFull;
  gameHistory?: ChessHistory;
  homeColor?: ChessGameColor;
  activityLog = Array<string>();
  auth : RequestInit = {};
  userId? : string;
  challengeId?:string;
  private pubsy = new Pubsy<LichessManagerEvents>();

  constructor() {}

  init = (auth: NonNullable<RegisteredUserRecord>) => {
    this.auth = {
      headers : { Authorization: `Bearer ` + auth.externalAccounts?.lichess?.accessToken }
    };
    this.userId = auth.externalAccounts?.lichess?.userId;
  }

  // startStream = () => {
  //   console.log('LichessManager => Starting Init Process');
  //   getLichessStreamEvent(this.auth)
  //   .map((reader) => {
  //     console.log('LichessManager => stream started successfull');
  //     this.pubsy.publish('onStreamStart', undefined);
  //     return reader;
  //   })
  //   .map((reader) => this.loopThroughNDJson(reader))
  //   .mapErr(() => {
  //     console.log('LichessManager ==> stream started failed! ');
  //     return new Err('StreamFailed');
  //   })
  //   // .mapErr((e) => console.log('LichessManager => error creating the stream', e.value));
  // }

  startStreamAndChallenge = (specs: GameSpecsRecord) => {
    console.log('START STREAM EVENT');
    getLichessStreamEvent(this.auth)
    .flatMap(reader => {
      this.pubsy.publish('onStreamStart', undefined);
      this.loopThroughNDJson(reader)
      return sendAChallenge('tttcr', {
        ...this.auth,
        body: new URLSearchParams({
          // 'color': specs.preferredColor, 
          'color': 'white',
          'clock.limit' : (chessGameTimeLimitMsMap[specs.timeLimit]/1000).toString(),
          'clock.increment' : '0'
        }),
      })
    })
    .map((reader) => this.loopThroughNDJson(reader))
    .mapErr(e => console.log('Error starting a stream', e.value));
  };

  private gameStart = (id: string) => {
    console.log('get board by id');
    getBoardStreamById(id, this.auth)
    .map(reader => this.loopThroughNDJson(reader))
    .mapErr(e => console.log('Error starting the game', e.value));
  };

  makeMove = (move: ChessMove) => {
    if (!this.lichessGame) {
      return;
    }
    const normalMove: NormalMove = {
      from: parseSquare(move.from),
      to: parseSquare(move.to),
    };
    sendAMove(makeUci(normalMove), this.lichessGame.id, this.auth)
    .map(e => console.log('move successfull!'))
    .mapErr(e => console.log('move failed!'))
  };

  // sendChallenge = (specs: GameSpecsRecord) => {
  //   sendAChallenge('tttcr', {
  //     ...this.auth,
  //     body: new URLSearchParams({
  //       // 'color': specs.preferredColor, 
  //       'color': 'white',
  //       'clock.limit' : (chessGameTimeLimitMsMap[specs.timeLimit]/1000).toString(),
  //       'clock.increment' : '0'
  //     }),
  //   })
  //   .map(reader => this.loopThroughNDJson(reader))
  //   .mapErr(e => console.log('Error sending a challenge', e.value))
  // };

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

  private getReader(response: Response) {
    return ndjsonStream(response.body).getReader();
  }

  private async loopThroughNDJson(reader: NDJsonReader) {
    try {
      const event = await reader.read();

      console.log('EVENT ', event);

      if (event.done && !event.value) {
        console.log('DONE DECODING STREAM');
        return;
      }
      if (event.value.type === 'gameStart') {
        this.gameStart(event.value['game']['id'] as string);
      }
      if (event.value.type === 'gameFull') {
        if (!this.homeColor) {
          this.homeColor = getHomeColor(
            event.value,
            this.userId as string
          );
        }
        console.log('GAME FULL ', this.lichessGame);
        if (!this.lichessGame && event.value.id === this.challengeId) {
          this.pubsy.publish('onChallengeAccepted', undefined);
        }
        this.lichessGame = event.value as LichessGameFull;
        this.updateGame();
      }
      if (event.value.type === 'gameState' && this.lichessGame) {
        this.lichessGame.state = event.value as LichessGameState;
        this.updateGame();
        if (event.value.winner) {
          //this.pubsy.publish('onGameFinish', { game: this.updateGame() });
        }
      }
      if (event.value.type === 'gameFinish' && this.lichessGame) {
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

  onGameUpdate(fn: (data: {game: LichessGameFull, gameHistory: ChessHistory}) => void) {
    this.pubsy.subscribe('onGameUpdate', fn);
  }

  updateGame() {
    const chess = getNewChessGame();
    this.gameHistory = [];
    if (this.lichessGame) {
      this.lichessGame.state.moves
        .split(' ')
        .filter((move) => move)
        .forEach((move, index) => {
          const normalMove = parseUci(move) as NormalMove;
          const color = index % 2 === 0 ? 'white' : 'black';
          this.gameHistory!.push({
            to: makeSquare(normalMove.to),
            from: makeSquare(normalMove.from),
            color,
            san: chess.move({
              to: makeSquare(normalMove.to),
              from: makeSquare(normalMove.from),
              promotion: normalMove.promotion?.charAt(0) as ShortMove['promotion'],
            })!.san,
            clock: this.lichessGame!.state[color === 'white' ? 'wtime' : 'btime'],
          });
          console.log('history ==> ', this.gameHistory);
          return chess;
        });
    }
    this.pubsy.publish('onGameUpdate', {game: this.lichessGame!, gameHistory: this.gameHistory })
   // return lichessStateToGame(this.lichessGame!, this.authorization.user, this.gameHistory);
  }
}

export type LichessManagerType = LichessManager;

let instance: LichessManager;
export const getInstance = () => {
  if (!instance) {
    instance = new LichessManager();
  }
  return instance;
};
