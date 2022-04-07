import { getHttpInstance } from 'src/lib/http';
import {
  io,
  publicRoomsResponsePayload,
  PublicRoomsResponsePayload,
  Resources,
} from 'chessroulette-io';
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

export const getRoom = (req: Resources.Util.RequestOf<typeof resource>) => {
  const { resource } = Resources.Collections.Room.GetRoom;

  return resource.request(req, (params) => http.get('api/rooms', { params }));
};

export const createRoom = (req: Resources.Util.RequestOf<typeof resource>) => {
  const { resource } = Resources.Collections.Room.CreateRoom;

  return resource.request(req, (body) => http.post('api/rooms', body));
};

export const scheduleRoom = (req: Resources.Util.RequestOf<typeof resource>) => {
  const { resource } = Resources.Collections.Room.ScheduleRoom;

  return resource.request(req, (body) => http.post('api/rooms/schedule', body));
};

export const canJoinRoom = (req: Resources.Util.RequestOf<typeof resource>) => {
  const { resource } = Resources.Collections.Room.CanJoinRoom;

  return resource.request(req, (params) => http.get(`/api/rooms/${req.slug}/can-join`, { params }));
};

// Room Challenge

export const createRoomChallenge = (req: Resources.Util.RequestOf<typeof resource>) => {
  const { resource } = Resources.Collections.Room.RoomChallenge.CreateRoomChallenge;

  return resource.request(req, (params) =>
    http.post(`api/rooms/${params.roomId}/challenges`, params)
  );
};

export const acceptRoomChallenge = (req: Resources.Util.RequestOf<typeof resource>) => {
  const { resource } = Resources.Collections.Room.RoomChallenge.AcceptRoomChallenge;

  return resource.request(req, (params) =>
    http.post(`api/rooms/${params.roomId}/challenges/accept`, params)
  );
};

export const deleteRoomChallenge = (req: Resources.Util.RequestOf<typeof resource>) => {
  const { resource } = Resources.Collections.Room.RoomChallenge.RemoveRoomChallenge;

  return resource.request(req, (params) =>
    http.delete(`api/rooms/${params.roomId}/challenges/${params.challengeId}`)
  );
};
