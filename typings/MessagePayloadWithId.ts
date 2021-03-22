import { ChatMessageRecordWithReadFeature } from './chatMessageRecord';
export type MessagePayloadWithId = {
    kind: "broadcastChatMessage";
    content: ChatMessageRecordWithReadFeature
}