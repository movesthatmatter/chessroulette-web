import { getHttpInstance } from 'src/lib/http';
import { io, publicRoomsResponsePayload, PublicRoomsResponsePayload, Resources } from 'chessroulette-io';
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

const { resource: getRoomResource } = Resources.Collections.Room.GetRoom;

export const getRoom = (req: Resources.Util.RequestOf<typeof getRoomResource>) =>
  getRoomResource.request(req, (params) => http.get('api/rooms', { params }));

const { resource: createRoomResource } = Resources.Collections.Room.CreateRoom;

export const createRoom = (req: Resources.Util.RequestOf<typeof createRoomResource>) =>
  createRoomResource.request(req, (body) => http.post('api/rooms', body));

const { resource: scheduleRoomResource } = Resources.Collections.Room.ScheduleRoom;

export const scheduleRoom = (req: Resources.Util.RequestOf<typeof scheduleRoomResource>) =>
  scheduleRoomResource.request(req, (body) => http.post('api/rooms/schedule', body));


// Room Challenge

const {
  resource: createRoomChallengeResource,
} = Resources.Collections.Room.RoomChallenge.CreateRoomChallenge;

export const createRoomChallenge = (
  req: Resources.Util.RequestOf<typeof createRoomChallengeResource>
) =>
  createRoomChallengeResource.request(req, (params) =>
    http.post(`api/rooms/${params.roomId}/challenges`, params)
  );

const {
  resource: acceptRoomChallengeResource,
} = Resources.Collections.Room.RoomChallenge.AcceptRoomChallenge;

export const acceptRoomChallenge = (
  req: Resources.Util.RequestOf<typeof acceptRoomChallengeResource>
) =>
  acceptRoomChallengeResource.request(req, (params) =>
    http.post(`api/rooms/${params.roomId}/challenges/accept`, params)
  );

const {
  resource: removeRoomChallengeResource,
} = Resources.Collections.Room.RoomChallenge.RemoveRoomChallenge;

export const deleteRoomChallenge = (
  req: Resources.Util.RequestOf<typeof removeRoomChallengeResource>
) =>
  removeRoomChallengeResource.request(req, (params) =>
    http.delete(`api/rooms/${params.roomId}/challenges/${params.challengeId}`)
  );
