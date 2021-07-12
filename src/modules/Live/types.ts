import { CollaboratorRecord } from 'dstnd-io';

export type CollaboratorAsStreamer = CollaboratorRecord & {
  isLive: boolean;
};

export type StreamerCollection = {
  featured: CollaboratorAsStreamer;
  restInRankedOrder: CollaboratorAsStreamer[];
};
