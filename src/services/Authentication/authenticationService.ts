import * as io from 'io-ts';
import { AsyncResult, AsyncResultWrapper, Err, guestUserRecord, Ok, toResult } from 'dstnd-io';
import { Pubsy } from 'src/lib/Pubsy';

// TODO: Use something better (more secure) than
// local storage, like the https cookie, which is
// the norm for JWT

const authenticationRecord = io.union([
  io.type({
    isGuest: io.literal(false),
    accessToken: io.string,
  }),
  guestUserRecord,
]);

export type AuthenticationRecord = io.TypeOf<typeof authenticationRecord>;

const key = 'authentication';

const pubsy = new Pubsy<{
  onUpdated: AuthenticationRecord | undefined;
}>();

const get = () => {
  return new AsyncResultWrapper<AuthenticationRecord, void>(() => {
    const data = localStorage.getItem(key);

    if (!data) {
      return Err.EMPTY;
    }

    try {
      return toResult(authenticationRecord.decode(JSON.parse(data))).mapErr(() => undefined);
    } catch (e) {
      return Err.EMPTY;
    }
  });
};

const createSilently = <T extends AuthenticationRecord>(authentication: T) => {
  return new AsyncResultWrapper<T, void>(() => {
    localStorage.setItem(key, JSON.stringify(authentication));

    return new Ok(authentication);
  });
};

const create = (authentication: AuthenticationRecord) => {
  return createSilently(authentication).map(
    AsyncResult.passThrough(() => {
      pubsy.publish('onUpdated', authentication);
    })
  );
};

const remove = () => {
  return new AsyncResultWrapper<void, void>(() => {
    localStorage.removeItem(key);

    pubsy.publish('onUpdated', undefined);

    return Ok.EMPTY;
  });
};

const onUpdated = (fn: (state: AuthenticationRecord | undefined) => void) => {
  return pubsy.subscribe('onUpdated', fn);
};

export const authenticationService = {
  get,
  create,
  createSilently,
  remove,
  onUpdated,
};
