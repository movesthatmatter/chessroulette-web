import * as io from 'io-ts';
import { AsyncResult, AsyncResultWrapper, Err, guestUserRecord, GuestUserRecord, Ok, toResult } from 'dstnd-io';
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
      return toResult(authenticationRecord.decode(JSON.parse(data)))
        .mapErr(() => undefined);
    } catch (e) {
      return Err.EMPTY;
    }
  });
}

const create = (authentication: AuthenticationRecord) => {
  return new AsyncResultWrapper<void, void>(() => {
    localStorage.setItem(key, JSON.stringify(authentication));

    pubsy.publish('onUpdated', authentication);

    return Ok.EMPTY;
  });
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
}

// const getAccessToken = () => {
//   return new AsyncResultWrapper<string, void>(() => {
//     const token = localStorage.getItem(key);

//     if (typeof token === 'string' && token.length > 0) {
//       return new Ok(token);
//     }

//     return Err.EMPTY;
//   });
// };

// const persistAccessToken = (accessToken: string) => {
//   return new AsyncResultWrapper<void, void>(() => {
//     localStorage.setItem(accessTokenKey, accessToken);

//     return Ok.EMPTY;
//   })
//   .map(AsyncResult.passThrough(() => {
//     // Make sure the Guest isn't there anymore
//     removeGuest();
//   }));
// };

// const removeAccessToken = () => {
//   return new AsyncResultWrapper<void, void>(() => {
//     localStorage.removeItem(accessTokenKey);

//     return Ok.EMPTY;
//   });
// };

// const guestKey = 'crAuthentication:guest';

// const getGuest = () => {
//   return new AsyncResultWrapper<GuestUserRecord, void>(() => {
//     const data = localStorage.getItem(guestKey);

//     if (!data) {
//       return Err.EMPTY;
//     }

//     return toResult(guestUserRecord.decode(JSON.parse(data))).mapErr(() => undefined);
//   });
// };

// const persistGuest = (guest: GuestUserRecord) => {
//   return new AsyncResultWrapper<void, void>(() => {
//     localStorage.setItem(JSON.stringify(guest), guestKey);

//     return Ok.EMPTY;
//   })
//   .map(AsyncResult.passThrough(() => {
//     // Make sure the Guest isn't there anymore
//     removeAccessToken();
//   }));
// };

// const removeGuest = () => {
//   return new AsyncResultWrapper<void, void>(() => {
//     localStorage.removeItem(guestKey);

//     return Ok.EMPTY;
//   });
// };

export const authentication = {
  get,
  create,
  remove,
  onUpdated,
  // getAccessToken,
  // persistAccessToken,
  // removeAccessToken,

  // getGuest,
  // persistGuest,
  // removeGuest,
};
