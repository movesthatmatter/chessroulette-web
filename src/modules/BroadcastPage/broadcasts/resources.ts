import ndjsonStream from 'can-ndjson-stream'
import api from 'src/resources/lichessAPI'
import { AsyncResultWrapper } from 'ts-async-results'
import { Err, Ok } from 'ts-results'
import { ApiError, NDJsonReaderUniversal } from '../types'

export const getLichessBroadcastGames = (opts: RequestInit) => {
  return new AsyncResultWrapper<NDJsonReaderUniversal<unknown>, ApiError>(async () => {
    try {
      const result =  await api.get('broadcast', opts) 
      return new Ok(ndjsonStream(result.body).getReader())
    }catch (e) {
      return new Err({type: 'BadRequest', value: e})
    }
  })
}