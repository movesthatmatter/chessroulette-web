import {
  GameJoinRequestPayload,
  GameAbortionRequestPayload,
  GameMoveRequestPayload,
  ChessMove,
  GameResignationRequestPayload,
  GameDrawOfferingRequestPayload,
  GameDrawAcceptRequestPayload,
  GameDrawDenyRequestPayload,
  GameRematchOfferingRequestPayload,
  GameRematchAcceptRequestPayload,
  GameRematchDenyRequestPayload,
  GameOfferingCancelRequestPayload,
  GameStatusCheckRequestPayload,
} from 'dstnd-io';

export const gameActions = {
  join: (): GameJoinRequestPayload => ({
    kind: 'gameJoinRequest',
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
  acceptDraw: (): GameDrawAcceptRequestPayload => ({
    kind: 'gameDrawAcceptRequest',
    content: undefined,
  }),
  denyDraw: (): GameDrawDenyRequestPayload => ({
    kind: 'gameDrawDenyRequest',
    content: undefined,
  }),
  // acceptDraw: () => {},
  resign: (): GameResignationRequestPayload => ({
    kind: 'gameResignationRequest',
    content: undefined,
  }),
  offerRematch: (): GameRematchOfferingRequestPayload => ({
    kind: 'gameRematchOfferingRequest',
    content: undefined,
  }),
  acceptRematch: (): GameRematchAcceptRequestPayload => ({
    kind: 'gameRematchAcceptRequest',
    content: undefined,
  }),
  denyRematch: (): GameRematchDenyRequestPayload => ({
    kind: 'gameRematchDenyRequest',
    content: undefined,
  }),
  cancelOffer: (): GameOfferingCancelRequestPayload => ({
    kind: 'gameOfferingCancelRequest',
    content: undefined,
  }),
  statusCheck: (): GameStatusCheckRequestPayload => ({
    kind: 'gameStatusCheckRequest',
    content: undefined,
  }),
};
