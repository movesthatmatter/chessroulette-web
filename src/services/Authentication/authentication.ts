import { AsyncResultWrapper, Err, Ok } from 'dstnd-io'

// TODO: Use something better (more secure) than
// local storage, like the https cookie, which is
// the norm for JWT

const key = 'crAccessToken';

const getAccessToken = () => {
  return new AsyncResultWrapper<string, void>(() => {
    const token = localStorage.getItem(key);

    if (typeof token === 'string' && token.length > 0) {
      return new Ok(token);
    }

    return Err.EMPTY;
  });
}

const persistAccessToken = (accessToken: string) => {
  return new AsyncResultWrapper<void, void>(() => {
    localStorage.setItem(key, accessToken);
    
    return Ok.EMPTY;
  });
}

const removeAccessToken = () => {
  return new AsyncResultWrapper<void, void>(() => {
    localStorage.removeItem(key);
    
    return Ok.EMPTY;
  });
}

export const authentication = {
  getAccessToken,
  persistAccessToken,
  removeAccessToken,
};
