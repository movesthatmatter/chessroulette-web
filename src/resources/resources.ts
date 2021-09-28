import { getHttpInstance } from 'src/lib/http';
import {
  io,
  createRoomResponse,
  CreateRoomResponse,
  CreateChallengeRequest,
  createChallengeResponse,
  iceServersResponse,
  IceServersResponse,
  RegisterPeerRequestPayload,
  RegisterPeerResponsePayload,
  registerPeerResponsePayload,
  CreateChallengeResponse,
  ChallengeRecord,
  challengeRecord,
  AcceptChallengeRequest,
  QuickPairingRequest,
  QuickPairingResponse,
  quickPairingResponse,
} from 'dstnd-io';
import config from 'src/config';
import { Result, Err, Ok } from 'ts-results';
import { AsyncResultWrapper } from 'ts-async-results';

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
    await http.delete(`api/challenges/${id}`);

    return Ok.EMPTY;
  } catch (e) {
    return new Err('BadRequest');
  }
});

export const quickPair = (
  req: QuickPairingRequest
) => new AsyncResultWrapper<QuickPairingResponse, ApiError>(async () => {
  try {
    const { data } = await http.post(`api/challenges/quickpair`, req);

    return io
      .toResult(quickPairingResponse.decode(data))
      .mapErr(() => 'BadResponse');
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
