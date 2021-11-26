import { isDeepEqual } from 'src/lib/util';
import { BaseRoomActivity } from '../../RoomActivity/redux/types';

export const hasRoomActivityChanged = (current?: BaseRoomActivity, prev?: BaseRoomActivity) => {
  if (
    (prev === undefined && current !== undefined) ||
    (current === undefined && prev !== undefined)
  ) {
    return true;
  }

  if (prev?.type !== current?.type) {
    return true;
  }

  // Play
  if (prev?.type === 'play' && current?.type === 'play') {
    // Game
    if (prev.game?.lastActivityAt !== current.game?.lastActivityAt) {
      return true;
    }

    if (prev.game?.state !== current.game?.state) {
      return true;
    }

    if (prev.game?.pgn !== current.game?.pgn) {
      return true;
    }

    // Offer
    if (current.offer?.id !== prev?.offer?.id) {
      return true;
    }
  }

  // Analysis
  if (prev?.type === 'analysis' && current?.type === 'analysis') {
    if (prev.analysisId !== current.analysisId) {
      return true;
    }

    return !isDeepEqual(prev.analysis || {}, current.analysis || {});
  }

  // Relay
  if (prev?.type === 'relay' && current?.type === 'relay') {
    if (prev.relayId !== current.relayId) {
      return true;
    }
    if (prev.game !== current.game) {
      return true;
    }
    if (prev.game?.pgn !== current.game?.pgn) {
      return true;
    }
    if (prev.game?.lastActivityAt !== current.game?.lastActivityAt) {
      return true;
    }
  }

  return false;
};
