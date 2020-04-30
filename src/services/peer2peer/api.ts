import { http } from 'src/lib/http';
import { Result, Err, Ok } from 'ts-results';
import { isLeft } from 'fp-ts/lib/Either';
import {
  JoinRoomRequestPayloadRecord,
  JoinRoomResponsePayloadRecord,
  joinRoomResponsePayload,
} from './records/HttpPayload';


export enum ApiErrors {
  BadRequest = 'Bad Request',
  BadResponse = 'Bad Response',
}

export const joinRoom = async (
  body: JoinRoomRequestPayloadRecord,
): Promise<Result<JoinRoomResponsePayloadRecord, ApiErrors.BadRequest | ApiErrors.BadResponse>> => {
  try {
    const response = await http.post('http://localhost:7777/api/join-room', body);

    // console.log('ss', response);

    const decoded = joinRoomResponsePayload.decode(response.data);

    if (isLeft(decoded)) {
      return new Err(ApiErrors.BadResponse);
    }

    return new Ok(decoded.right);
  } catch {
    return new Err(ApiErrors.BadRequest);
  }
};
