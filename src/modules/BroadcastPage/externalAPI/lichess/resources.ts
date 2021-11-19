import ndjsonStream from 'can-ndjson-stream';
import api from 'src/resources/lichessAPI';
import { AsyncResultWrapper } from 'ts-async-results';
import { Err, Ok } from 'ts-results';
import { ReadableStream } from 'window-or-global';
import { ApiError, NDJsonReaderUniversal } from '../../types';

export const getLichessBroadcastGames = (opts: RequestInit) => {
  return new AsyncResultWrapper<NDJsonReaderUniversal<any>, ApiError>(async () => {
    try {
      const result = await api.get('broadcast', opts);
      return new Ok(ndjsonStream(result.body).getReader());
    } catch (e) {
      return new Err({ type: 'BadRequest', value: e });
    }
  });
};

export const getCurrentFeaturedLichessGame = (opts: RequestInit) => {
  return new AsyncResultWrapper<NDJsonReaderUniversal<unknown>, ApiError>(async () => {
    try {
      const result = await api.get('tv/feed', opts);
      return new Ok(ndjsonStream(result.body).getReader());
    } catch (e) {
      return new Err({ type: 'BadRequest', value: e });
    }
  });
};

export const getOngoingBroadcastAsPGNStream = (opts:RequestInit, broadcastRoundId: string) => {
  return new AsyncResultWrapper<ReadableStream<Uint8Array>, ApiError>(async () => {
    try  {
      const result = await api.get(`stream/broadcast/round/${broadcastRoundId}.pgn`, opts);

      if (!result.body) {
        return new Err({type: 'BadRequest'});
      }

      return new Ok(result.body)
    }catch (e) {
      return new Err({type : 'BadRequest', value: e})
    }
  })
}
