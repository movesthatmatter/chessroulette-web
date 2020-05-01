import * as io from 'io-ts';
import { gameDataRecord } from 'src/modules/Game/records/GameDataRecord';
import { chatMessageRecord } from './ChatDataRecord';

export const peerDataRecord = io.union([
  gameDataRecord,
  chatMessageRecord,
]);

export type PeerDataRecord = io.TypeOf<typeof peerDataRecord>;
