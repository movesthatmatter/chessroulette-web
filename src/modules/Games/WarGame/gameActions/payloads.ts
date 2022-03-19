import {
  GameStatusCheckRequestPayload,
  GameSpecsRecord,
  WarGameJoinRequestPayload,
  WarGameChallengeOfferingRequestPayload,
  WarGameChallengeAcceptRequestPayload,
  WarGameChallengeDenyRequestPayload,
  WarGameMove,
  WarGameMoveRequestPayload,
  WarGameDrawOfferingRequestPayload,
  WarGameDrawOfferAcceptRequestPayload,
  WarGameDrawOfferDenyRequestPayload,
  WarGameRematchOfferingRequestPayload,
  WarGameRematchAcceptRequestPayload,
  WarGameResignationRequestPayload, 
  WarGameRematchDenyRequestPayload
} from 'dstnd-io';

export type OfferRematchProps = {
  gameSpecs?: GameSpecsRecord;
};

export const warGameActionPayloads = {
  join: (): WarGameJoinRequestPayload => ({
    kind: 'warGameJoinRequest',
    content: undefined,
  }),
  offerChallenge: (
    content: WarGameChallengeOfferingRequestPayload['content']
  ): WarGameChallengeOfferingRequestPayload => ({
    kind: 'warGameChallengeOfferingRequest',
    content,
  }),
  acceptChallenge: (): WarGameChallengeAcceptRequestPayload => ({
    kind: 'warGameChallengeAcceptRequest',
    content: undefined,
  }),
  denyChallenge: (): WarGameChallengeDenyRequestPayload => ({
    kind: 'warGameChallengeDenyRequest',
    content: undefined,
  }),
  move: (move: WarGameMove): WarGameMoveRequestPayload => ({
    kind: 'warGameMoveRequest',
    content: move,
  }),
  statusCheck: (): GameStatusCheckRequestPayload => ({
    kind: 'gameStatusCheckRequest',
    content: undefined,
  }),
  offerDraw: () : WarGameDrawOfferingRequestPayload => ({
    kind: 'warGameDrawOfferingRequest',
    content: undefined
  }),
  acceptDraw: (): WarGameDrawOfferAcceptRequestPayload => ({
    kind: 'warGameDrawOfferAcceptRequest',
    content: undefined
  }),
  denyDraw: (): WarGameDrawOfferDenyRequestPayload => ({
    kind: 'warGameDrawOfferDenyRequest',
    content: undefined
  }),
  resign: () : WarGameResignationRequestPayload => ({
    kind: 'warGameResignationRequest',
    content: undefined
  }),
  offerRematch: ({gameSpecs}: OfferRematchProps): WarGameRematchOfferingRequestPayload => ({
    kind: 'warGameRematchOfferingRequest',
    content: gameSpecs ? {gameSpecs} : undefined
  }),
  acceptRematch: (): WarGameRematchAcceptRequestPayload => ({
    kind: 'warGameRematchAcceptRequest',
    content: undefined
  }),
  denyRematch: (): WarGameRematchDenyRequestPayload => ({
    kind:'warGameRematchDenyRequest',
    content: undefined
  }),
  
};
