import ndjsonStream from 'can-ndjson-stream';
import { AsyncResultWrapper, Err, Ok } from 'dstnd-io';
import { NDJsonReader } from './types';

type ApiError = {
  type: 'BadRequest' | 'BadResponse';
  value: unknown;
};

export function getLichessStreamEvent(opts: RequestInit) {
  return new AsyncResultWrapper<NDJsonReader, ApiError>(async () => {
    try {
      const result = await fetch('https://lichess.org/api/stream/event', {
        method: 'GET',
        headers: opts.headers,
      });
      return new Ok(ndjsonStream(result.body).getReader());
    } catch (e) {
      return new Err({ type: 'BadRequest', value: e });
    }
  });
}

export function getBoardStreamById(id: string, opts: RequestInit) {
  return new AsyncResultWrapper<NDJsonReader, ApiError>(async () => {
    try {
      const result = await fetch(`https://lichess.org/api/board/game/stream/${id}`, {
        method: 'GET',
        headers: opts.headers,
      });
      return new Ok(ndjsonStream(result.body).getReader());
    } catch (e) {
      return new Err({ type: 'BadRequest', value: e });
    }
  });
}

export function sendAChallenge(userName: string, opts: RequestInit) {
  return new AsyncResultWrapper<NDJsonReader, ApiError>(async () => {
    try {
      const result = await fetch(`https://lichess.org/api/challenge/${userName}`, {
        method: 'POST',
        headers: {
          ...opts.headers,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: opts.body,
      });
      return new Ok(ndjsonStream(result.body).getReader());
    } catch (e) {
      return new Err({ type: 'BadRequest', value: e });
    }
  });
}

export function sendAMove(move: string, id: string, opts: RequestInit) {
  return new AsyncResultWrapper<{ ok: true }, { ok: false; error: any }>(async () => {
    try {
      await fetch(`https://lichess.org/api/board/game/${id}/move/${move}`, {
        method: 'POST',
        headers: opts.headers,
      });
      return new Ok({ ok: true } as const);
    } catch (e) {
      return new Err({ ok: false, error: e } as const);
    }
  });
}

export function acceptChallenge(challengeId: string, opts: RequestInit) {
  return new AsyncResultWrapper<NDJsonReader, ApiError>(async () => {
    try {
      const result = await fetch(`https://lichess.org/api/challenge/${challengeId}/accept`, {
        method: 'POST',
        headers: opts.headers,
      });
      return new Ok(ndjsonStream(result.body).getReader());
    } catch (e) {
      return new Err({ type: 'BadRequest', value: e });
    }
  });
}

export function declineChallenge(challengeId: string, opts: RequestInit) {
  return new AsyncResultWrapper<NDJsonReader, ApiError>(async () => {
    try {
      const result = await fetch(`https://lichess.org/api/challenge/${challengeId}/decline`, {
        method: 'POST',
        headers: opts.headers,
      });
      return new Ok(ndjsonStream(result.body).getReader());
    } catch (e) {
      return new Err({ type: 'BadRequest', value: e });
    }
  });
}