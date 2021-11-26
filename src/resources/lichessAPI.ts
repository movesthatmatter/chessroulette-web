import { fetch } from 'window-or-global';

const baseURL =  `https://lichess.org/api/`;

const api = {
  get : (path: string, opts: RequestInit) => fetch(baseURL + path, {
    method: 'GET', 
    headers: opts.headers, 
    ...(opts.body && {body: opts.body})
  }),
  post: (path: string, opts: RequestInit) => fetch(baseURL + path, {
    method: 'POST', 
    headers: opts.headers, 
    ...(opts.body && {body: opts.body})
  })
}

export default api;