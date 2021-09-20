import { getHttpInstance } from 'src/lib/http';
import {
  io,
  publicRoomsResponsePayload,
  createRoomResponse,
  CreateRoomRequest,
  CreateRoomResponse,
  privateRoomResponsePayload,
  publicRoomResponsePayload,
  PublicRoomResponsePayload,
  PublicRoomsResponsePayload,
  PrivateRoomResponsePayload,
  AsyncResultWrapper,
  RoomResponsePayload,
  roomResponsePayload,
  Resources,
} from 'dstnd-io';
import config from 'src/config';
import { Result, Err } from 'ts-results';

type ApiError = 'BadRequest' | 'BadResponse';

const http = getHttpInstance({
  baseURL: config.HTTP_ENDPOINT,
});

export const getPublicRooms = async (): Promise<Result<PublicRoomsResponsePayload, ApiError>> => {
  try {
    const { data } = await http.get('api/rooms');

    return io.toResult(publicRoomsResponsePayload.decode(data)).mapErr(() => 'BadResponse');
  } catch (e) {
    return new Err('BadRequest');
  }
};

export const getPublicRoom = async (
  id: string
): Promise<Result<PublicRoomResponsePayload, ApiError>> => {
  try {
    const { data } = await http.get(`/api/room/${id}`);

    return io.toResult(publicRoomResponsePayload.decode(data)).mapErr(() => 'BadResponse');
  } catch (e) {
    return new Err('BadRequest');
  }
};

export const getPrivateRoom = (code: string) => {
  return new AsyncResultWrapper<PrivateRoomResponsePayload, ApiError>(async () => {
    try {
      const { data } = await http.get('/api/room', { params: { code } });

      return io.toResult(privateRoomResponsePayload.decode(data)).mapErr(() => 'BadResponse');
    } catch (e) {
      return new Err('BadRequest');
    }
  });
};

export const getRoom = (credentials: { roomId: string; code?: string }) => {
  return new AsyncResultWrapper<RoomResponsePayload, ApiError>(async () => {
    try {
      const { data } = await http.get(`/api/rooms/${credentials.roomId}`, {
        params: {
          ...(credentials.code && {
            code: credentials.code,
          }),
        },
      });

      return io.toResult(roomResponsePayload.decode(data)).mapErr(() => 'BadResponse');
    } catch (e) {
      return new Err('BadRequest');
    }
  });
};

export const getRoomBySlug = (slug: string) => {
  return new AsyncResultWrapper<RoomResponsePayload, ApiError>(async () => {
    try {
      const { data } = await http.get(`/api/rooms/slug/${slug}`);

      return io.toResult(roomResponsePayload.decode(data)).mapErr(() => 'BadResponse');
    } catch (e) {
      return new Err('BadRequest');
    }
  });
};

export const createRoom = (req: CreateRoomRequest) =>
  new AsyncResultWrapper<CreateRoomResponse, ApiError>(async () => {
    try {
      const { data } = await http.post('api/rooms', req);

      return io.toResult(createRoomResponse.decode(data)).mapErr(() => 'BadResponse' as const);
    } catch (e) {
      return new Err('BadRequest');
    }
  });

const { resource: createRoomChallengeResource } = Resources.Collections.Room.RoomChallenge.CreateRoomChallenge;

export const createRoomChallenge = (req: Resources.Util.RequestOf<typeof createRoomChallengeResource>) => {
  return createRoomChallengeResource.request(req, (params) => http.post(`api/rooms/challenges`, params));
}

const { resource: acceptRoomChallengeResource } = Resources.Collections.Room.RoomChallenge.AcceptRoomChallenge;

export const acceptRoomChallenge = (req: Resources.Util.RequestOf<typeof acceptRoomChallengeResource>) => {
  return acceptRoomChallengeResource.request(req, (params) => http.post(`api/rooms/challenges/accept`, params));
}

const { resource: removeRoomChallengeResource } = Resources.Collections.Room.RoomChallenge.RemoveRoomChallenge;

export const deleteRoomChallenge = (req: Resources.Util.RequestOf<typeof removeRoomChallengeResource>) => {
  return removeRoomChallengeResource.request(req, (params) => http.delete(`api/rooms/${params.roomId}/challenges/${params.challengeId}`));
}
