import { iceServersResponse, IceServersResponse, io } from 'dstnd-io';
import { AsyncResultWrapper } from 'ts-async-results';
import { Err } from 'ts-results';
import { http } from 'src/lib/http';

type ApiError = 'BadRequest' | 'BadResponse';

export const getIceURLS = () =>
  new AsyncResultWrapper<IceServersResponse, ApiError>(async () => {
    try {
      const { data } = await http.get('api/iceurls');

      return io.toResult(iceServersResponse.decode(data)).mapErr(() => 'BadResponse');
    } catch (e) {
      return new Err('BadRequest');
    }
  });
