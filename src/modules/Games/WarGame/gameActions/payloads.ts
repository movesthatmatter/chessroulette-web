import {
  GameStatusCheckRequestPayload,
  GameSpecsRecord, WarGameJoinRequestPayload, WarGameChallengeOfferingRequestPayload, WarGameChallengeAcceptRequestPayload, WarGameChallengeDenyRequestPayload, WarGameMove, WarGameMoveRequestPayload
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
  denyChallenge: (
  ): WarGameChallengeDenyRequestPayload => ({
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
};
