import {
  io,
  LichessAuthenticationRedirectUrlPayload,
  lichessAuthenticationRedirectUrlResponsePayload,
  AsyncResultWrapper,
  Err,
  VerifyLichessUserRequestPayload,
  VerifyLichessUserResponsePayload,
  verifyLichessUserResponsePayload,
} from 'dstnd-io';
import config from 'src/config';
import { getHttpInstance } from 'src/lib/http';

const http = getHttpInstance({
  baseURL: `${config.HTTP_ENDPOINT}/vendors/lichess/auth`,
});

type ApiError = 'BadRequest' | 'BadResponse';


export const getRedirectUrl = () => {
  return new AsyncResultWrapper<LichessAuthenticationRedirectUrlPayload, ApiError>(async () => {
    try {
      const { data } = await http.get('/url');

      return io
        .deserialize(lichessAuthenticationRedirectUrlResponsePayload, data)
        .mapErr(() => 'BadResponse');
    } catch (e) {
      return new Err('BadRequest');
    }
  });
}

export const verifyLichessUser = (req: VerifyLichessUserRequestPayload) => {
  return new AsyncResultWrapper<VerifyLichessUserResponsePayload, ApiError>(async () => {
    try {
      const { data } = await http.post('/verify', req);

      return io
        .toResult(verifyLichessUserResponsePayload.decode(data))
        .mapErr(() => 'BadResponse');
    } catch (e) {
      return new Err('BadRequest');
    }
  });
};
