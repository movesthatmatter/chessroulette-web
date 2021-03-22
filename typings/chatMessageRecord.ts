
import {ChatMessageRecord as dstndMessageRecord} from 'dstnd-io';

type Maybe<T> = T | null;

export type ChatMessageRecordWithReadFeature = dstndMessageRecord & Maybe<{
    read? : boolean;
}> & {
    id : string;
}