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
  GameChallengeOfferingRequestPayload,
  GameChallengeDenyRequestPayload,
  GameChallengeAcceptRequestPayload,
  GameSpecsRecord,
} from 'dstnd-io';

export type OfferRematchProps = {
  gameSpecs?: GameSpecsRecord;
};

export const gameActions = {
  join: (): GameJoinRequestPayload => ({
    kind: 'gameJoinRequest',
    content: undefined,
  }),
  offerChallenge: (
    content: GameChallengeOfferingRequestPayload['content']
  ): GameChallengeOfferingRequestPayload => ({
    kind: 'gameChallengeOfferingRequest',
    content,
  }),
  acceptChallenge: (): GameChallengeAcceptRequestPayload => ({
    kind: 'gameChallengeAcceptRequest',
    content: undefined,
  }),
  denyChallenge: (
  ): GameChallengeDenyRequestPayload => ({
    kind: 'gameChallengeDenyRequest',
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
  offerRematch: ({ gameSpecs }: OfferRematchProps): GameRematchOfferingRequestPayload => ({
    kind: 'gameRematchOfferingRequest',
    content: gameSpecs ? { gameSpecs } : undefined,
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
