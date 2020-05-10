import { getHttpInstance } from 'src/lib/http';
import { Err, Result, Ok } from 'ts-results';
import {
  // JoinRoomRequestPayloadRecord,
  // joinRoomResponsePayload,
  // publicRoomsPayload,
  io,
  publicRoomsResponsePayload,
  createRoomResponse,
  CreateRoomRequest,
  CreateRoomResponse,
  JoinRoomRequestPayload,
} from 'dstnd-io';
import config from 'src/config';

type ApiError = 'BadRequest' | 'BadResponse';

const http = getHttpInstance({
  baseURL: config.HTTP_ENDPOINT,
  // transformRequest: [],
  // transformResponse: [],
});

export const getPublicRooms = async () => {
  try {
    const { data } = await http.get('api/rooms');

    return io
      .deserialize(publicRoomsResponsePayload, data)
      .mapErr(() => 'BadResponse');
  } catch (e) {
    return new Err('BadRequest');
  }
};

export const createRoom = async (
  req: CreateRoomRequest,
): Promise<Result<CreateRoomResponse, ApiError>> => {
  try {
    const { data } = await http.post('api/rooms', req);

    return io
      .toResult(createRoomResponse.decode(data))
      .mapErr(() => 'BadResponse');
  } catch (e) {
    return new Err('BadRequest');
  }
};

// export const joinPrivateRoom = async (
//   req: JoinPrivateRoomRequestPayload,
// ): Promise<Result<void, ApiError>> => {
//   try {
//     await http.post('/api/join-rooms', req);

//     return Ok.EMPTY;
//   } catch (e) {
//     return new Err('BadRequest');
//   }
// };
