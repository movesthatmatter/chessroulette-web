import { UserRecord } from 'dstnd-io';
import { PeerStreamingConfig } from 'src/providers/PeerProvider';

export type StreamConfig = PeerStreamingConfig;

export type StreamConfigByUserIdMap = Record<UserRecord['id'], PeerStreamingConfig>