import ndjsonStream from 'can-ndjson-stream';
import { acceptChallenge, declineChallenge, getBoardStreamById, getLichessStreamEvent, sendAChallenge, sendAMove } from './resources';
import { LichessGameState, NDJsonReader, LichessGameFull, LichessChallenge } from './types';
import { console } from 'window-or-global';
import { Pubsy } from 'src/lib/Pubsy';
import { parseUci, makeUci, makeSquare, parseSquare } from 'chessops/util';
import { ChessGameColor, ChessMove } from 'dstnd-io';
import { NormalMove } from 'chessops/types';
import { ChessInstance, getNewChessGame } from '../Games/Chess/lib';
import { ShortMove } from 'chess.js';

type LichessManagerEvents = {
  onUpdateChess: { chess : ChessInstance};
  onGameFinish: {game: LichessGameFull};
  onChallenge: {challenge: LichessChallenge};
};

export class LichessManager {
  game?: LichessGameFull;
  //chess: ChessInstance;
  homeColor?: ChessGameColor;
  authorization: {
    headers: {
      Authorization: string;
    };
  };
  activityLog = Array<string>();
  private pubsy = new Pubsy<LichessManagerEvents>();

  constructor() {
    this.authorization = { headers: { Authorization: `Bearer q8OPhcRniAriA7DT` } };
    this.activityLog = [];
    //this.chess = getNewChessGame();
  }

  startStream = () => {
    console.log('START STREAM EVENT');
    getLichessStreamEvent(this.authorization)
      .then(this.getReader)
      .then((res) => this.loopThroughNDJson(res))
      .catch((e) => console.log('ERRRO in getting the stream', e));
  };

  private gameStart = (id: string) => {
    console.log('GAME START GET BOARD BY ID', id);
    getBoardStreamById(id, this.authorization)
      .then(this.getReader)
      .then((res) => this.loopThroughNDJson(res))
      .catch((e) => console.log('error connecting or starting a game', e));
  };

  makeMove = (move: ChessMove) => {
    if (!this.game) {
      return;
    }
    console.log('make move');
    const normalMove: NormalMove = {
      from: parseSquare(move.from),
      to: parseSquare(move.to),
    };
    sendAMove(makeUci(normalMove), this.game.id, this.authorization)
      .then((res) => console.log('response from making a move', res))
      .catch((e) => console.log('error making a move', e));
  };

  sendChallenge = () => {
    console.log('SENDING CHALLENGE');
    this.homeColor = 'black';
    sendAChallenge('tttcr', {
      ...this.authorization,
      body: new URLSearchParams({
        color: 'black',
      }),
    })
      .then(this.getReader)
      .then((res) => this.loopThroughNDJson(res))
      .catch((e) => console.log('error sending a challenge', e));
  };

  acceptChallenge =(challenge: LichessChallenge) => {
    acceptChallenge(challenge.id, this.authorization)
    .then(this.getReader)
    .then(res => this.loopThroughNDJson(res))
    .catch(e => console.log('error accepting the challenge', e))
  }

  declineChallenge = (challenge: LichessChallenge) => {
    declineChallenge(challenge.id, this.authorization)
    .then(this.getReader)
    .then(res => this.loopThroughNDJson(res))
    .catch(e => console.log('error declining a challenge', e))
  }

  private getReader(response: Response) {
    return ndjsonStream(response.body).getReader();
  }

  private async loopThroughNDJson(reader: NDJsonReader) {
    try {
      console.log('reading another event')
      const event = await reader.read();

      console.log('EVENT ', event);

      if (event.done) {
        console.log('DONE DECODING STREAM');
        return;
      }
      if (event.value.type === 'gameStart') {
        this.gameStart(event.value['game']['id'] as string);
      }
      if (event.value.type === 'gameFull') {
        this.game = event.value as LichessGameFull;
        this.updateChess()
      }
      if (event.value.type === 'gameState' && this.game) {
        this.game.state = event.value as LichessGameState;
        this.updateChess()
        if (event.value.winner){
          this.pubsy.publish('onGameFinish', {game: this.game});
        }
      }
      if (event.value.type === 'gameFinish' && this.game) {
        console.log('FINSHED GAME!!!', event);
      }
      if (event.value.type === 'challenge') {
        this.pubsy.publish('onChallenge', {challenge: event.value.challenge as LichessChallenge})
      }
      this.loopThroughNDJson(reader);
    } catch (e) {
      console.log('error parsing the current event', e);
    }
  }

  onChallenge(fn: (data: {challenge: LichessChallenge}) => void){
    this.pubsy.subscribe('onChallenge', fn);
  }

  onGameFinished(fn : (data: {game: LichessGameFull}) => void){
    this.pubsy.subscribe('onGameFinish', fn);
  }

  onUpdateChess(fn : (data : {chess: ChessInstance}) => void){
    this.pubsy.subscribe('onUpdateChess', fn);
  }

  updateChess() {
    const chess = getNewChessGame();
    if (this.game) {
      this.game.state.moves
        .split(' ')
        .filter((move) => move)
        .forEach((move) => {
          const normalMove = parseUci(move) as NormalMove;
          const shortMove: ShortMove = {
            to: makeSquare(normalMove.to),
            from: makeSquare(normalMove.from)
          }
          return chess.move(shortMove)
        });
    }
    console.log('NEW CHESS', chess);
    this.pubsy.publish('onUpdateChess', {chess})
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
