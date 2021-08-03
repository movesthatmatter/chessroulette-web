import { serverError } from "dstnd-io/dist/sdk/resource/errors";
import config from "src/config";
import ndjsonStream from 'can-ndjson-stream';
import { getBoardStreamById, getLichessStreamEvent, sendAChallenge } from "./resources";
import { LichessAPIConfig, LichessGame, LichessGameState, NDJsonReader } from "./types";
import { console } from "window-or-global";


export class LichessManager {
  game? : LichessGame
  authorization: { 
    headers : {
      Authorization: string;
    }
  }
  activityLog = Array<string>()

  constructor(readonly redraw: () => void){
    this.authorization = { headers : {'Authorization': `Bearer q8OPhcRniAriA7DT` }}
  }

  startStream = async () => {
    console.log('START STREAM EVENT');
    try {
      const stream = await getLichessStreamEvent(this.authorization);
      this.activityLog.push('Connected');
      const reader = ndjsonStream(stream.body).getReader();
      
      this.loopThroughNDJson(reader);
    } catch (e) {
      console.log('ERRRO in getting the stream', e)
    }

  }
  private async loopThroughNDJson (reader: NDJsonReader) {
    const data = await reader.read();

    if (data.done) {
      console.log('DONE DECODING STREAM');
      return;
    }
    if (data.value['type'] === 'gameStart'){
      this.activityLog.push('Game Started');
      console.log('starting game');
      this.gameStart(data.value['game']['id'] as string);
    }
    if (data.value['type'] === 'gameFull') {
      this.activityLog.push('Game Has Finished');
      console.log('finished game');
      this.game = data.value as LichessGame
      this.redraw();
    }
    if (data.value['type'] === 'gameState' && this.game) {
      this.game.state = data.value as LichessGameState;
      console.log('game state update ==> ', data.value);
      this.redraw();
    }

    console.log('current data (no condition) ', data.value);
    this.loopThroughNDJson(reader);
  }

  gameStart = async (id:string) => {
    try {
      const stream = await getBoardStreamById(id, this.authorization);
      const reader = ndjsonStream(stream.body).getReader();
      this.loopThroughNDJson(reader);
    } catch (e){
      console.log('error connecting to the game');
    }
  }

  sendChallenge = async () => {
    console.log('SENDING a challenge');
    try {
      sendAChallenge('tttcr',{
        ...this.authorization,
        body: JSON.stringify({
          username: 'tttcr',
        })
      })
      .then(res =>  {
        this.activityLog.push('Challenge SENT!')
        const reader = ndjsonStream(res.body).getReader();
        this.loopThroughNDJson(reader);
      })
    } catch (e) {
      console.log('error sending a challenge',e)
    }
  }
  // onMainEvent = (event: any) => {
  //   if (event['type'] == 'gameStart') {
  //     getBoardStreamById(event['game']['id'])
  //     .then(ndjson(this.onGameEvent))
  //   }
  //   this.redraw();
  // }

  // onGameEvent = (event: any) => {
  //   if (event['type'] == 'gameFull') {
  //     this.game = event as LichessGame;
  //   } else if (event['type'] == 'gameState' && this.game) {
  //     this.game.state = event as LichessGameState;
  //     console.log('this game state ==> ', this.game.state);
  //     // this.chessground!.set({
  //     //   fen: makeBoardFen(this.currentChess().board)
  //     // });
  //   }
  //   this.redraw();
  // }
}

let instance: LichessManager;
export const getInstance = (redraw : () => void) => {
  if (!instance) {
    instance = new LichessManager(redraw);
  }
  return instance;
}