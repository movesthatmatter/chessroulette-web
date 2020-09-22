import {
  io,
  AuthenticationResponsePayload,
  authenticationResponsePayload,
  AuthenticationRequestPayload,
  GuestAuthenticationResponsePayload,
  guestAuthenticationResponsePayload,
  GuestAuthenticationRequestPayload,
  GuestUserRecord,
  Result, 
  Err,
} from 'dstnd-io';
import { getHttpInstance } from 'src/lib/http';
import config from 'src/config';

const http = getHttpInstance({
  baseURL: `${config.HTTP_ENDPOINT}/api/auth`,
});

type ApiError = 'BadRequest' | 'BadResponse';

export const authenticate = async (
  req: AuthenticationRequestPayload,
): Promise<Result<AuthenticationResponsePayload, ApiError>> => {
  try {
    const { data } = await http.post('/', req);

    return io
      .toResult(authenticationResponsePayload.decode(data))
      .mapErr(() => 'BadResponse');
  } catch (e) {
    return new Err('BadRequest');
  }
};

export const authenticateAsGuest = async (): Promise<
  Result<GuestAuthenticationResponsePayload, ApiError>
> => {
  try {
    const { data } = await http.post('/guest');

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
    const { data } = await http.post('/guest', req);

    return io
      .toResult(guestAuthenticationResponsePayload.decode(data))
      .mapErr(() => 'BadResponse');
  } catch (e) {
    return new Err('BadRequest');
  }
};