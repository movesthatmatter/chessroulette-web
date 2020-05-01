import * as io from 'io-ts';

export const chatMessageRecord = io.type({
  msgType: io.literal('chatMessage'),
  content: io.string,
});

export type ChatMessageRecord = io.TypeOf<typeof chatMessageRecord>;
