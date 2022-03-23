import { CollaboratorRecord, ResourceRecords } from 'chessroulette-io';

export type CollaboratorAsStreamer = CollaboratorRecord & {
  isLive: boolean;
};

export type StreamerCollection = {
  featured: CollaboratorAsStreamer;
  restInRankedOrder: CollaboratorAsStreamer[];
};

export type LiveStreamer = ResourceRecords.Watch.LiveStreamerRecord;

export type Streamer = ResourceRecords.Watch.StreamerRecord;