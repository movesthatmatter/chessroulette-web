import config from 'src/config';
import ndjsonStream from 'can-ndjson-stream';
import { getBoardStreamById, getLichessStreamEvent, sendAChallenge } from './resources';
import { LichessGame, LichessGameState, NDJsonReader, LichessStreamEvent } from './types';
import { console } from 'window-or-global';
import { Pubsy } from 'src/lib/Pubsy';
import {Chess} from 'chessops/chess';
import {parseUci, makeUci} from 'chessops/util';
import { makeBoardFen } from 'chessops/fen';

export class LichessManager {
  game?: LichessGame;
  authorization: {
    headers: {
      Authorization: string;
    };
  };
  private activityLog = Array<string>();
  private pubsy = new Pubsy<{onUpdateFen : {fen : string}}>();

  constructor() {
    this.authorization = { headers: { Authorization: `Bearer q8OPhcRniAriA7DT` } };
    this.activityLog = [];

  }

  startStream = () => {
    console.log('START STREAM EVENT');
    getLichessStreamEvent(this.authorization)
      .then(this.getReader)
      .then(res => this.loopThroughNDJson(res))
      .catch((e) => console.log('ERRRO in getting the stream', e));
  };
  gameStart = (id: string) => {
    console.log('GAME START GET BOARD BY ID', id);
    getBoardStreamById(id, this.authorization)
      .then(this.getReader)
      .then((res) =>  this.loopThroughNDJson(res))
      .catch((e) => console.log('error connecting or starting a game', e));
  };

  sendChallenge = () => {
    console.log('SENDING CHALLENGE')
    sendAChallenge('tttcr', {
      ...this.authorization,
      body: new URLSearchParams({
          'color': 'black'
      }),
    })
      .then(this.getReader)
      .then(res => this.loopThroughNDJson(res))
      .catch((e) => console.log('error sending a challenge', e));
  };

  private getReader(response: Response) {
    return ndjsonStream(response.body).getReader();
  }

  private async loopThroughNDJson(reader: NDJsonReader) {
    try {
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
        this.game = event.value as LichessGame;
      }
      if (event.value['type'] === 'gameState' && this.game) {
        this.game.state = event.value as LichessGameState;
        this.updateFen(event.value);
      }

      this.loopThroughNDJson(reader);
    } catch (e) {
      console.log('error parsing the current event', e);
    }
  }

  private updateFen(state: LichessGameState){
    console.log('pubsy update with new fen !')
   this.pubsy.publish('onUpdateFen', {fen : this.makeFen(this.getMovesFromUCI())})
  }

  onUpdateFen (fn : (data : {fen : string}) => void) {
    console.log('pubsy subscribe! ');
    this.pubsy.subscribe('onUpdateFen', fn);
  }

  private getMovesFromUCI() {
    const chess = Chess.default();
    if (this.game){
      this.game.state.moves.split(' ').filter(move => move).forEach(move => chess.play(parseUci(move)!))
    }
    console.log('NEW CHESS', chess);
    return chess
  }

  private makeFen(chess:Chess) {
    return makeBoardFen(chess.board)
  }
}

export type LichessManagerType = LichessManager

let instance: LichessManager;
export const getInstance = () => {
  if (!instance) {
    instance = new LichessManager();
  }
  return instance;
};
