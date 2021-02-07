import {
  io,
  GuestAuthenticationResponsePayload,
  guestAuthenticationResponsePayload,
  GuestAuthenticationRequestPayload,
  UserCheckRequestPayload,
  userCheckResponsePayload,
  UserCheckResponsePayload,
  Result,
  Err,
  AsyncResultWrapper,
  CreateUserAccountRequestPayload,
  createUserAccountResponsePayload,
  CreateUserAccountResponsePayload,
  VerifyEmailRequestPayload,
  VerifyEmailResponsePayload,
  Ok,
  registeredUserRecord,
  RegisteredUserRecord,
} from 'dstnd-io';
import { http } from 'src/lib/http';


type ApiError = 'BadRequest' | 'BadResponse';

export const verifyEmail = (req: VerifyEmailRequestPayload) => {
  return new AsyncResultWrapper<VerifyEmailResponsePayload, ApiError>(async () => {
    try {
      await http.post('/api/auth/verify-email', req);

      return new Ok(undefined);
    } catch (e) {
      return new Err('BadRequest');
    }
  });
}

export const checkUser = (req: UserCheckRequestPayload) => {
  return new AsyncResultWrapper<UserCheckResponsePayload, ApiError>(async () => {
    try {
      const { data } = await http.post('/api/auth', req);

      return io.toResult(userCheckResponsePayload.decode(data))
        .mapErr(() => 'BadResponse');
    } catch (e) {
      return new Err('BadRequest');
    }
  });
}

export const createUser = (req: CreateUserAccountRequestPayload) => {
  return new AsyncResultWrapper<CreateUserAccountResponsePayload, ApiError>(async () => {
    try {
      const { data } = await http.post('/api/auth/register', req);

      return io.toResult(createUserAccountResponsePayload.decode(data))
        .mapErr(() => 'BadResponse');
    } catch (e) {
      return new Err('BadRequest');
    }
  });
}

export const getUser = (accessToken: string) => {
  return new AsyncResultWrapper<RegisteredUserRecord, ApiError>(async () => {
    try {
      const { data } = await http.get('/api/users', {
        headers: {
          'auth-token': accessToken,
        },
      });

      return io.toResult(registeredUserRecord.decode(data))
        .mapErr(() => 'BadResponse');
    } catch (e) {
      return new Err('BadRequest');
    }
  });
}

export const authenticateAsGuest = async (): Promise<
  Result<GuestAuthenticationResponsePayload, ApiError>
> => {
  try {
    const { data } = await http.post('/api/auth/guest');

    return io
      .toResult(guestAuthenticationResponsePayload.decode(data))
      .mapErr(() => 'BadResponse');
  } catch (e) {
    return new Err('BadRequest');
  }
};

export const authenticateAsExistentGuest = async (
  req: GuestAuthenticationRequestPayload,
): Promise<Result<GuestAuthenticationResponsePayload, ApiError>> => {
  try {
    const { data } = await http.post('/api/auth/guest', req);

    return io
      .toResult(guestAuthenticationResponsePayload.decode(data))
      .mapErr(() => 'BadResponse');
  } catch (e) {
    return new Err('BadRequest');
  }
};
