import { UserRecord } from 'chessroulette-io';
import { PeerStreamingConfig } from 'src/providers/PeerConnectionProvider';

export type StreamConfig = PeerStreamingConfig;

export type StreamConfigByUserIdMap = Record<UserRecord['id'], PeerStreamingConfig>;
