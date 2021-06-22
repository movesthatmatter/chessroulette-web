import {
  io,
  VendorsAuthenticationRedirectUrlPayload,
  vendorsAuthenticationRedirectUrlResponsePayload,
  AsyncResultWrapper,
  Err,
  ExternalVendor,
} from 'dstnd-io';
import { http } from 'src/lib/http';


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
