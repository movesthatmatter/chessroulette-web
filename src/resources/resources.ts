import { getHttpInstance } from 'src/lib/http';
import { Err, Result } from 'ts-results';
import {
  io,
  publicRoomsResponsePayload,
  createRoomResponse,
  CreateRoomRequest,
  CreateRoomResponse,
  CreateChallengeRequest,
  createChallengeResponse,
  privateRoomResponsePayload,
  publicRoomResponsePayload,
  PublicRoomResponsePayload,
  PublicRoomsResponsePayload,
  PrivateRoomResponsePayload,
  iceServersResponse,
  IceServersResponse,
} from 'dstnd-io';
import config from 'src/config';

type ApiError = 'BadRequest' | 'BadResponse';

const http = getHttpInstance({
  baseURL: config.HTTP_ENDPOINT,
  // transformRequest: [],
  // transformResponse: [],
});

export const getIceURLS = async (): Promise<Result<IceServersResponse, ApiError>> => {
  try {
    const { data } = await http.get('api/iceurls');

    return io
      .toResult(iceServersResponse.decode(data))
      .map((servers) => servers.filter((s) => !s.credential))
      .mapErr(() => 'BadResponse');
  } catch (e) {
    return new Err('BadRequest');
  }
};

export const getPublicRooms = async (): Promise<
Result<PublicRoomsResponsePayload, ApiError>
> => {
  try {
    const { data } = await http.get('api/rooms');

    return io
      .toResult(publicRoomsResponsePayload.decode(data))
      .mapErr(() => 'BadResponse');
  } catch (e) {
    return new Err('BadRequest');
  }
};

export const getPublicRoom = async (
  id: string,
): Promise<Result<PublicRoomResponsePayload, ApiError>> => {
  try {
    const { data } = await http.get(`/api/room?id=${id}`);

    return io
      .toResult(publicRoomResponsePayload.decode(data))
      .mapErr(() => 'BadResponse');
  } catch (e) {
    return new Err('BadRequest');
  }
};

export const getPrivateRoom = async (
  code: string,
): Promise<Result<PrivateRoomResponsePayload, ApiError>> => {
  try {
    const { data } = await http.get('/api/room', {
      params: {
        code,
      },
    });

    return io
      .toResult(privateRoomResponsePayload.decode(data))
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

export const createChallenge = async (
  req: CreateChallengeRequest,
): Promise<Result<CreateRoomResponse, ApiError>> => {
  try {
    const { data } = await http.post('api/challenges', req);

    return io
      .toResult(createChallengeResponse.decode(data))
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
