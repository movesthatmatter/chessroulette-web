import {
  io,
  VendorsAuthenticationRedirectUrlPayload,
  vendorsAuthenticationRedirectUrlResponsePayload,
  VerifyUserRequestPayload,
  VerifyLichessUserResponsePayload, 
  verifyLichessUserResponsePayload, VerifyTwitchUserResponsePayload, verifyTwitchUserResponsePayload
} from 'chessroulette-io';
import config from 'src/config';
import { getHttpInstance } from 'src/lib/http';
import { AsyncResultWrapper } from 'ts-async-results';
import { Err } from 'ts-results';

const http = getHttpInstance({
  baseURL: `${config.HTTP_ENDPOINT}/vendors/lichess/oauth`,
});

type ApiError = 'BadRequest' | 'BadResponse';


export const getRedirectUrl = () => {
  return new AsyncResultWrapper<VendorsAuthenticationRedirectUrlPayload, ApiError>(async () => {
    try {
      const { data } = await http.get('/url');

      return io
        .deserialize(vendorsAuthenticationRedirectUrlResponsePayload, data)
        .mapErr(() => 'BadResponse');
    } catch (e) {
      return new Err('BadRequest');
    }
  });
}

export const verifyLichessUser = (req: VerifyUserRequestPayload) => {
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

export const verifyTwitchUser = (req: VerifyTwitchUserResponsePayload) => {
  return new AsyncResultWrapper<VerifyTwitchUserResponsePayload, ApiError>(async () => {
    try {
      const {data} = await http.post('/verify', req);

      return io
      .toResult(verifyTwitchUserResponsePayload.decode(data))
      .mapErr(() => 'BadResponse')
    } catch (e) {
      return new Err('BadRequest')
    }
  })
}