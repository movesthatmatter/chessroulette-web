import { getHttpInstance } from 'src/lib/http';
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
  RegisterPeerRequestPayload,
  RegisterPeerResponsePayload,
  registerPeerResponsePayload,
  AsyncResultWrapper,
  RoomResponsePayload,
  roomResponsePayload,
  CreateChallengeResponse,
  ChallengeRecord,
  challengeRecord,
  AcceptChallengeRequest,
} from 'dstnd-io';
import config from 'src/config';
import { Result, Err, Ok } from 'ts-results';

type ApiError = 'BadRequest' | 'BadResponse';

const http = getHttpInstance({
  baseURL: config.HTTP_ENDPOINT,
  // transformRequest: [],
  // transformResponse: [],
});

export const getIceURLS = async (): Promise<
  Result<IceServersResponse, ApiError>
> => {
  try {
    const { data } = await http.get('api/iceurls');

    return io
      .toResult(iceServersResponse.decode(data))
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
    const { data } = await http.get(`/api/room/${id}`);

    return io
      .toResult(publicRoomResponsePayload.decode(data))
      .mapErr(() => 'BadResponse');
  } catch (e) {
    return new Err('BadRequest');
  }
};

export const getPrivateRoom = (
  code: string,
) => {
  return new AsyncResultWrapper<PrivateRoomResponsePayload, ApiError>(async () => {
    try {
      const { data } = await http.get(
        '/api/room',
        { params: { code }},
      );
  
      return io
        .toResult(privateRoomResponsePayload.decode(data))
        .mapErr(() => 'BadResponse');
    } catch (e) {
      return new Err('BadRequest');
    }
  });
};

export const getRoom = (credentials: {
  roomId: string;
  code?: string;
}) => {
  return new AsyncResultWrapper<RoomResponsePayload, ApiError>(async () => {
    try {
      const { data } = await http.get(
        `/api/rooms/${credentials.roomId}`,
        { 
          params: {
            ...credentials.code && {
              code: credentials.code,
            },
          },
        },
      );
  
      return io
        .toResult(roomResponsePayload.decode(data))
        .mapErr(() => 'BadResponse');
    } catch (e) {
      return new Err('BadRequest');
    }
  });
};

export const createRoom = (
  req: CreateRoomRequest,
) => new AsyncResultWrapper<CreateRoomResponse, ApiError>(async () => {
  try {
    const { data } = await http.post('api/rooms', req);

    return io
      .toResult(createRoomResponse.decode(data))
      .mapErr(() => 'BadResponse' as const);
  } catch (e) {
    return new Err('BadRequest');
  }
});

export const createChallenge = (
  req: CreateChallengeRequest,
) => new AsyncResultWrapper<CreateChallengeResponse, ApiError>(async () => {
  try {
    const { data } = await http.post('api/challenges', req);

    return io
      .toResult(createChallengeResponse.decode(data))
      .mapErr(() => 'BadResponse');
  } catch (e) {
    return new Err('BadRequest');
  }
});

export const getChallengeBySlug = (
  slug: string,
) => new AsyncResultWrapper<ChallengeRecord, ApiError>(async () => {
  try {
    const { data } = await http.get('api/challenges', { params: { slug } });

    return io
      .toResult(challengeRecord.decode(data))
      .mapErr(() => 'BadResponse');
  } catch (e) {
    return new Err('BadRequest');
  }
});

export const acceptChallenge = (
  req: AcceptChallengeRequest,
) => new AsyncResultWrapper<CreateRoomResponse, ApiError>(async () => {
  try {
    const { data } = await http.post('api/challenges/accept', req);

    return io
      .toResult(createRoomResponse.decode(data))
      .mapErr(() => 'BadResponse');
  } catch (e) {
    return new Err('BadRequest');
  }
});

// TODO: This needs to make sure the user is also the one that created it
// Later through auth or smtg like that
export const deleteChallenge = (
  id: ChallengeRecord['id'],
) => new AsyncResultWrapper<void, ApiError>(async () => {
  try {
    console.trace('delete challenge', id);
    await http.delete(`api/challenges/${id}`);

    return Ok.EMPTY;
  } catch (e) {
    return new Err('BadRequest');
  }
});

export const registerPeer = async (
  req: RegisterPeerRequestPayload,
): Promise<Result<RegisterPeerResponsePayload, ApiError>> => {
  try {
    const { data } = await http.post('api/peers', req);

    return io
      .toResult(registerPeerResponsePayload.decode(data))
      .mapErr(() => 'BadResponse');
  } catch (e) {
    return new Err('BadRequest');
  }
};

export const getGuestUserRegisteredAsPeer = async (): Promise<
  Result<RegisterPeerResponsePayload, ApiError>
> => {
  try {
    const { data } = await http.post('api/peers/guest');

    return io
      .toResult(registerPeerResponsePayload.decode(data))
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
