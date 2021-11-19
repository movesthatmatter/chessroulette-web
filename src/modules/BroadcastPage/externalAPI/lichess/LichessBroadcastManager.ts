import { Pubsy } from 'src/lib/Pubsy';
import { Game } from 'src/modules/Games';
import { console } from 'window-or-global';
import { NDJsonReaderUniversal } from '../../types';
import { parsePGNGamesFromExternalAPI } from '../pgnParser/pgnParser';
import { getLichessBroadcastGames, getOngoingBroadcastAsPGNStream } from './resources';
import { OfficialLichessBroadcastType } from './types';

type ArrayElement<A extends readonly Object[]> = A extends (infer T)[] ? T : never;

export type LichessBroadcastEvents = {
  onNewBroadcastEntry: { entry: OfficialLichessBroadcastType };
  onNewValueEntry: { value: unknown, done: boolean };
  onGameUpdate: { game: Game };
  onStreamEndedd: undefined;
  onError : {error: any};
};

export class LichessBroadcastManager {
  private pubsy = new Pubsy<LichessBroadcastEvents>();
  
  constructor() {}

  getBroadcastGames() {
    getLichessBroadcastGames({})
    .map(reader => this.loopThroughNDJson(reader))
    .mapErr(error => this.pubsy.publish('onError', {error}))
  }

  streamCurrentTournamentRound(roundId: string, onUpdates: (game: Game) => void){
    getOngoingBroadcastAsPGNStream({}, roundId)
    .map(reader => this.streamReader(reader, (chunk) => {
      if (!chunk.done) {
        parsePGNGamesFromExternalAPI(String(chunk.value));
       // onUpdates(chunk.value)
      }
      // TODO: Somehow call onUpdates when done as well
    }))
    .mapErr(error => this.pubsy.publish('onError', {error}));
  }

  private streamReader = (stream: ReadableStream<Uint8Array>, onData: (data: { value: unknown, done: boolean }) => void) => {
    stream.pipeThrough(new TextDecoderStream()).getReader().read().then((chunk) => {
        if (chunk.done) {
          onData({ done: true, value: undefined })
        }
        else {
          onData({ done: false, value: Array.from(chunk.value as any || [])})
        }
      });
  }

  private async loopThroughNDJson<T extends {} | unknown>(reader: NDJsonReaderUniversal<T>) {
    try {
      console.log('reader' , reader);
      const event = await reader.read();
      console.log('new event', event);
      if (event.done && !event.value) {
        console.log('DONE DECODING STREAM');
        return;
      
      }
      console.log('new event', event);
      this.pubsy.publish('onNewBroadcastEntry', {entry: event.value as unknown as OfficialLichessBroadcastType})

      this.loopThroughNDJson(reader);
    } catch (error) {
      this.pubsy.publish('onError', {error});
    }
  }

  onError(fn: (data: {error: any}) => void) {
    this.pubsy.subscribe('onError', fn);
  }

  onNewBroadcastEntry(fn: (data: {entry: OfficialLichessBroadcastType}) => void){
    this.pubsy.subscribe('onNewBroadcastEntry', fn);
  }

  onNewValueEntry(fn: (data: { value: unknown, done: boolean }) => void) {
    this.pubsy.subscribe('onNewValueEntry', fn);
  }

  onStreamEnded(fn: () => void){
    this.pubsy.subscribe('onStreamEndedd', fn);
  }
}
