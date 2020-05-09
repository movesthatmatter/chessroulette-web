import { getHttpInstance } from 'src/lib/http';
import { Err } from 'ts-results';
import {
  // JoinRoomRequestPayloadRecord,
  // joinRoomResponsePayload,
  // publicRoomsPayload,
  io, publicRoomsResponsePayload,
} from 'dstnd-io';
import config from 'src/config';

export enum ApiErrors {
  BadRequest = 'Bad Request',
  BadResponse = 'Bad Response',
}

const http = getHttpInstance({
  baseURL: config.HTTP_ENDPOINT,
  // transformRequest: [],
  // transformResponse: [],
});

export const getPublicRooms = async () => {
  try {
    const { data } = await http.get('api/rooms');

    return io.deserialize(publicRoomsResponsePayload, data).mapErr(
      () => ApiErrors.BadResponse,
    );
  } catch (e) {
    return new Err(ApiErrors.BadRequest);
  }
};

// export const joinRoom = async (request: JoinRoomRequestPayloadRecord) => {
//   try {
//     // TODO: This could use the serializer as well, especially
//     //  if it's not using the JSON payload
//     const { data } = await http.post(
//       'api/join-room',
//       request,
//     );

//     return deserialize(joinRoomResponsePayload, data).mapErr(
//       () => ApiErrors.BadResponse,
//     );
//   } catch {
//     return new Err(ApiErrors.BadRequest);
//   }
// };
