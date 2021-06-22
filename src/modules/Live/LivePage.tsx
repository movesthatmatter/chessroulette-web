import React, { useState } from 'react';
import { Page } from 'src/components/Page';
import { createUseStyles, NestedCSSElement } from 'src/lib/jss';
import { AspectRatio } from 'src/components/AspectRatio';
import ReactTwitchEmbedVideo from 'react-twitch-embed-video';
import { spacers } from 'src/theme/spacers';
import { effects } from 'src/theme';
import { useDeviceSize } from 'src/theme/hooks/useDeviceSize';

type Props = {};

const streamers = [
  {
    twitch: 'chesswithovi',
    rank: 900,
    on: false,
  },
  {
    twitch: 'chess',
    rank: 500,
    on: true,
  },
  {
    twitch: 'quaglon',
    rank: 600,
    on: false,
  },
  {
    twitch: 'art_vega1983',
    rank: 400,
    on: false,
  },
  {
    twitch: 'clsmith15',
    rank: 510,
    on: false,
  },
  {
    twitch: 'thinkerteacher',
    rank: 490,
    on: true,
  },
  {
    twitch: 'crybabycarly',
    rank: 680,
    on: false,
  },
  {
    twitch: 'road2gm3000',
    rank: 700,
    on: false,
  },
];

const getStreamers = (featuredTwitch?: string) => {
  const [featured, ...orderedByRankDesk] = streamers
    .map((s) => ({
      ...s,
      rank: s.rank + (s.on ? 1 : 0) * 1000 + (featuredTwitch === s.twitch ? 1 : 0) * 5000,
    }))
    .sort((a, b) => b.rank - a.rank);

  return {
    featured,
    streamers: orderedByRankDesk,
  };
};

export const LivePage: React.FC<Props> = (props) => {
  const cls = useStyles();
  const deviceSize = useDeviceSize();
  const [streamersCollection, setStreamersCollection] = useState(getStreamers());

  return (
    <Page name="Live">
      <div className={cls.container}>
        <div className={cls.main}>
          <AspectRatio aspectRatio={{ width: 16, height: 9 }}>
            {/* <div className={cls.videoContainer} /> */}
            <ReactTwitchEmbedVideo
              channel={streamersCollection.featured.twitch}
              layout="video"
              height="100%"
              width="100%"
              targetClass={cls.videoContainer}
              targetId={streamersCollection.featured.twitch}
            />
          </AspectRatio>
          <div
            style={{
              height: spacers.largestPx,
            }}
          />
          <div className={cls.streamerCollectionListMask}>
            <div className={cls.streamerCollectionList}>
              {streamersCollection.streamers.map((s) => (
                <AspectRatio
                  aspectRatio={{ width: 16, height: 9 }}
                  className={cls.aspect}
                  onClick={() => setStreamersCollection(getStreamers(s.twitch))}
                >
                  <ReactTwitchEmbedVideo
                    channel={s.twitch}
                    layout="video"
                    height="100%"
                    width="100%"
                    targetClass={cls.videoContainer}
                    targetId={s.twitch}
                    autoplay={false}
                  />
                </AspectRatio>
              ))}
            </div>
          </div>
        </div>
        {deviceSize.isMobile || (
          <>
            <div
              style={{
                width: spacers.large,
              }}
            />
            <div className={cls.side}>
              <iframe
                src={`https://www.twitch.tv/embed/${streamersCollection.featured.twitch}/chat?parent=localhost`}
                height="60% "
                width="100%"
                className={cls.chatContainer}
              ></iframe>
            </div>
          </>
        )}
      </div>
    </Page>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  main: {
    flex: 2.3,
  },
  side: {
    flex: 1,
  },
  videoContainer: {
    border: 0,
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundColor: '#ededed',

    width: '100%',
    height: '100%',
  },
  streamerCollectionListMask: {},
  streamerCollectionList: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  aspect: {
    width: `calc(${100 / 3}% - ${spacers.defaultPx * 1}px)`,
    marginRight: spacers.get(1.5),
    marginBottom: spacers.get(1.5),

    ...({
      '&:nth-child(3n)': {
        marginRight: 0,
      },
    } as NestedCSSElement),
  },
  chatContainer: {
    border: 0,
    borderRadius: '16px',
    overflow: 'hidden',
    ...effects.floatingShadow,
  },
});
