import { Chance } from 'chance';
import { LiveStreamerRecord, OfflineStreamerRecord, StreamerRecord } from 'dstnd-io/dist/resourceCollections/watch/records';
import { toISODateTime } from 'io-ts-isodatetime';
import { getRandomInt } from 'src/lib/util';
import { Date } from 'window-or-global';

const chance = new Chance();

const profileImageDummy = [
  "https://static-cdn.jtvnw.net/jtv_user_pictures/4795f5c9-0738-49cb-a646-8302dd5a71cd-profile_image-300x300.png",
  "https://static-cdn.jtvnw.net/jtv_user_pictures/e3431413-fe2b-4aaa-863a-456684267c8f-profile_image-300x300.png",
  "https://static-cdn.jtvnw.net/jtv_user_pictures/127e8bcd-56e8-4872-a733-79ee591f537f-profile_image-300x300.png",
  "https://static-cdn.jtvnw.net/jtv_user_pictures/f024e671-38ae-435d-91a5-62f3429d57ee-profile_image-300x300.png",
  "https://static-cdn.jtvnw.net/jtv_user_pictures/f5d54592-5bcc-445c-b237-bef37938151d-profile_image-300x300.png",
]


export class StreamerRecordMocker {
  public record(isLive: false) : OfflineStreamerRecord;
  public record(isLive: true): LiveStreamerRecord;
  public record(isLive = false): StreamerRecord {
    if (!isLive){
      return {
        id: chance.guid(),
        vendor: 'twitch',
        username: chance.name(),
        displayName: chance.name(),
        profileImageUrl: profileImageDummy[getRandomInt(0,5)],
        createdAt: toISODateTime(new Date()),
        description: chance.string(),
        isLive: false
      };
    }
    return {
      id: chance.guid(),
        vendor: 'twitch',
        username: chance.name(),
        displayName: chance.name(),
        profileImageUrl: profileImageDummy[getRandomInt(0,5)],
        createdAt: toISODateTime(new Date()),
        description: chance.string(),
        isLive: true,
        stream: {
          id: chance.guid(),
          userId: chance.guid(),
          userLogin: chance.name(),
          userName: chance.name(),
          type: '',
          viewerCount: 100,
          startedAt: toISODateTime(new Date()),
          gameName: 'chess',
          language: chance.country(),
          title: chance.string(),
          thumbnailUrl: chance.url(),
          isMature: false
        }
    }
  }
}
