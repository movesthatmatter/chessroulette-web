import { console, fetch, Promise } from "window-or-global"

export function getLichessStreamEvent (opts: RequestInit) {
  return fetch('https://lichess.org/api/stream/event', {method: 'GET', headers: opts.headers})
}

export function getBoardStreamById (id:string, opts: RequestInit){
  return fetch(`https://lichess.org/api/board/game/stream/${id}`, {method: 'GET', headers: opts.headers}) 
}

export function sendAChallenge (userName: string, opts: RequestInit){
  return fetch(`https://lichess.org/api/challenge/${userName}`, {
    method: 'POST', 
    headers: {
    ...opts.headers,
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: opts.body
  })
}