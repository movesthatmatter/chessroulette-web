import {
  GameJoinRequestPayload,
  GameAbortionRequestPayload,
  GameMoveRequestPayload,
  ChessMove,
  GameDrawOfferingRequestPayload,
  GameResignationRequestPayload,
} from 'dstnd-io';

export const gameActions = {
  join: (): GameJoinRequestPayload => ({
    kind: 'gameJoinRequest',
    content: undefined,
  }),
  abort: (): GameAbortionRequestPayload => ({
    kind: 'gameAbortionRequest',
    content: undefined,
  }),
  move: (move: ChessMove): GameMoveRequestPayload => ({
    kind: 'gameMoveRequest',
    content: move,
  }),
  offerDraw: (): GameDrawOfferingRequestPayload => ({
    kind: 'gameDrawOfferingRequest',
    content: undefined,
  }),
  // acceptDraw: () => {},
  resign: (): GameResignationRequestPayload => ({
    kind: 'gameResignationRequest',
    content: undefined,
  }),
};
