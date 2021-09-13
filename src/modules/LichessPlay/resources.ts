import ndjsonStream from 'can-ndjson-stream';
import { AsyncResultWrapper, Err, Ok } from 'dstnd-io';
import { NDJsonReader } from './types';
import api from './api';

type ApiError = {
  type: 'BadRequest';
  value: unknown;
};

export function getLichessStreamEvent(opts: RequestInit) {
  return new AsyncResultWrapper<NDJsonReader, ApiError>(async () => {
    try {
      const result = await api.get('stream/event',{
        headers: opts.headers
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
      const result = await api.get(`board/game/stream/${id}`, {
        headers: opts.headers,
      });
      return new Ok(ndjsonStream(result.body).getReader());
    } catch (e) {
      return new Err({ type: 'BadRequest', value: e });
    }
  });
}

export function startOpenSeek(opts: RequestInit) {
  return new AsyncResultWrapper<{ok: true},{ok: false, err: any}>(async () => {
    try {
      await api.post(`board/seek`, {
        headers: {
          ...opts.headers,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: opts.body
      });
      return new Ok({ok: true} as const)
    } catch (e) {
      return new Err({ok: false, err: e} as const)
    }
  })
}

export function sendAChallenge(userName: string, opts: RequestInit) {
  return new AsyncResultWrapper<NDJsonReader, ApiError>(async () => {
    try {
      const result = await api.post(`challenge/${userName}`, {
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
      await api.post(`board/game/${id}/move/${move}`, {
        headers: opts.headers,
      });
      return new Ok({ ok: true } as const);
    } catch (e) {
      return new Err({ ok: false, error: e } as const);
    }
  });
}

export function acceptChallenge(challengeId: string, opts: RequestInit) {
  return new AsyncResultWrapper<{ok: true}, {ok: false; error: any}>(async () => {
    try {
      await api.post(`challenge/${challengeId}/accept`, {
        headers: opts.headers,
      });
      return new Ok({ ok: true } as const);
    } catch (e) {
      return new Err({ ok: false, error: e } as const);
    }
  });
}

export function declineChallenge(challengeId: string, opts: RequestInit) {
  return new AsyncResultWrapper<{ok: true}, {ok: false; error: any}>(async () => {
    try {
      await api.post(`challenge/${challengeId}/decline`, {
        headers: opts.headers,
      });
      return new Ok({ ok: true } as const);
    } catch (e) {
      return new Err({ ok: false, error: e } as const);
    }
  });
}

export function sendAMessage(gameId: string, opts: RequestInit){
  return new AsyncResultWrapper<{ok: true}, {ok: false; error: any}>(async () => {
    try{
      await api.post(`board/game/${gameId}/chat`, {
        headers: {
          ...opts.headers,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: opts.body,
      })
      return new Ok({ok: true} as const)
    } catch (e) {
      return new Err({ ok: false, error: e } as const);
    }
  })
}

export function abortGame(gameId: string, opts: RequestInit){
  return new AsyncResultWrapper<{ok: true}, {ok:false; error:any}>(async () => {
    try {
      await api.post(`board/game/${gameId}/abort`, {
        headers: opts.headers
      })
      return new Ok({ok:true} as const )
    } catch (e) {
      return new Err({ ok: false, error: e } as const);
    }
  })
}

export function resignGame(gameId: string, opts: RequestInit){
  return new AsyncResultWrapper<{ok: true}, {ok: false; error: any}>(async () => {
    try {
      await api.post(`board/game/${gameId}/resign`, {
        headers: opts.headers
      })
      return new Ok({ok:true} as const)
    } catch (e) {
      return new Err({ ok: false, error: e } as const);
    }
  })
}

export function acceptOrOfferDraw(gameId: string, opts: RequestInit){
  return new AsyncResultWrapper<{ok: true}, {ok:false; error:any}>(async () => {
    try {
      await api.post(`board/game/${gameId}/draw/yes`, {
        headers: opts.headers
      })
      return new Ok({ok:true} as const)
    } catch (e) {
      return new Err({ ok: false, error: e } as const);
    }
  })
}

export function declineDrawOffer(gameId: string, opts: RequestInit){
  return new AsyncResultWrapper<{ok: true}, {ok: false; error: any}>(async () => {
    try {
      await api.post(`board/game/${gameId}/draw/no`, {
        headers: opts.headers
      })
      return new Ok({ok:true} as const)
    } catch (e) {
      return new Err({ ok: false, error: e } as const);
    }
  })
}

export function acceptOfOfferTakeback(gameId: string, opts:RequestInit){
  return new AsyncResultWrapper<{ok: true},{ok:false, error: any}>(async () => {
    try{
      await api.post(`board/game/${gameId}/takeback/yes`,{
        headers: opts.headers
      })
      return new Ok({ok:true} as const)
    } catch (e) {
      return new Err({ ok: false, error: e} as const);
    }
  })
}

export function declineTakeback(gameId: string, opts:RequestInit){
  return new AsyncResultWrapper<{ok: true},{ok:false, error: any}>(async () => {
    try{
      await api.post(`board/game/${gameId}/takeback/no`, {
        headers: opts.headers
      })
      return new Ok({ok:true} as const)
    } catch (e) {
      return new Err({ ok: false, error: e} as const);
    }
  })
}
