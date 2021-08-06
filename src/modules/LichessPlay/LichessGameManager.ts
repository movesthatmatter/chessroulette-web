import config from 'src/config';
import ndjsonStream from 'can-ndjson-stream';
import { getBoardStreamById, getLichessStreamEvent, sendAChallenge, sendAMove } from './resources';
import { LichessGameState, NDJsonReader, LichessGameFull } from './types';
import { console } from 'window-or-global';
import { Pubsy } from 'src/lib/Pubsy';
import { Chess } from 'chessops/chess';
import { parseUci, makeUci, makeSquare, parseSquare } from 'chessops/util';
import { makeBoardFen } from 'chessops/fen';
import { ChessGameColor, ChessHistory, ChessMove } from 'dstnd-io';
import { NormalMove } from 'chessops/types';
import { ChessInstance, getGameFromPgn, getNewChessGame, getStartingPgn } from '../Games/Chess/lib';
import { chessHistoryToSimplePgn } from 'dstnd-io/dist/chessGame/util/util';
import { chessGameActions } from 'dstnd-io';
import { ShortMove } from 'chess.js';

type LichessManagerEvents = {
  onUpdateChess: { chess : ChessInstance};
  onGameFinish: {chess: ChessInstance};
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
      if (event.value['type'] === 'gameStart') {
        this.gameStart(event.value['game']['id'] as string);
      }
      if (event.value['type'] === 'gameFull') {
        this.game = event.value as LichessGameFull;
        this.updateChess()
      }
      if (event.value['type'] === 'gameState' && this.game) {
        this.game.state = event.value as LichessGameState;
        this.updateChess()


      }
      if (event.value['type'] === 'gameFinish' && this.game) {
        console.log('FINSHED GAME!!!', event);
      }

      this.loopThroughNDJson(reader);
    } catch (e) {
      console.log('error parsing the current event', e);
    }
  }

  onGameFinished(fn : (data: {chess: ChessInstance}) => void){
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
