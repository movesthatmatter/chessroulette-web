import chunk from 'chunk';
import { useEffect, useState } from 'react';
import { CollaboratorAsStreamer, StreamerCollection } from '../types';
import { isTwitchChannelLive, promiseFirstResolvedInSeries } from '../util';
import { loadTwitchApi } from './loadTwitchApi';

export const toStreamerCollectionByRank = ([
  featured,
  ...restInRankedOrder
]: CollaboratorAsStreamer[]): StreamerCollection => ({
  featured,
  restInRankedOrder,
});

export const useGetStreamerCollectionWithLiveStatus = (streamers: CollaboratorAsStreamer[]) => {
  const [streamerCollection, setStreamerCollection] = useState(
    toStreamerCollectionByRank(streamers)
  );

  useEffect(() => {
    if (streamers.length === 0) {
      return;
    }

    loadTwitchApi(async (Twitch) => {
      const allStreamerPromiseGetters = streamers.map((streamer) => () =>
        isTwitchChannelLive(streamer.profileUrl, Twitch).then((isLive) => {
          if (!isLive) {
            // Reject it so the further Promise.any breaks
            return Promise.reject();
          }

          return { ...streamer, isLive };
        })
      );

      const chunkedStreamerPromiseGetters = chunk(allStreamerPromiseGetters, 3);

      const promisesOfChunks = chunkedStreamerPromiseGetters.map((streamerPromiseGetterChunk) => {
        // Return the 1st one to fulfill
        return () => Promise.any(streamerPromiseGetterChunk.map((getPromise) => getPromise()));
      });

      promiseFirstResolvedInSeries(promisesOfChunks).then((firstLiveStreamer) => {
        setStreamerCollection({
          featured: firstLiveStreamer,
          restInRankedOrder: streamers.filter((s) => s.profileUrl !== firstLiveStreamer.profileUrl),
        });
      });
    });
  }, [streamers]);

  return streamerCollection;
};
