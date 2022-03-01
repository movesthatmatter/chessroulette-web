import {
  io,
  VendorsAuthenticationRedirectUrlPayload,
  vendorsAuthenticationRedirectUrlResponsePayload,
  ExternalVendor,
} from 'chessroulette-io';
import { http } from 'src/lib/http';
import { AsyncResultWrapper } from 'ts-async-results';
import { Err } from 'ts-results';


type ApiError = 'BadRequest' | 'BadResponse';

export const getRedirectUrl = (vendor: ExternalVendor) => {
  return new AsyncResultWrapper<VendorsAuthenticationRedirectUrlPayload, ApiError>(async () => {
    try {
      const { data } = await http.get(`/vendors/${vendor}/oauth/url`);

      return io
        .deserialize(
         vendorsAuthenticationRedirectUrlResponsePayload, data)
        .mapErr(() => 'BadResponse');
    } catch (e) {
      return new Err('BadRequest');
    }
  });
};
