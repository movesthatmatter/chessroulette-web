import React, { useEffect, useState } from 'react';
import { Page } from 'src/components/Page';
import { createUseStyles, NestedCSSElement } from 'src/lib/jss';
import { AspectRatio } from 'src/components/AspectRatio';
import ReactTwitchEmbedVideo from 'react-twitch-embed-video';
import { spacers } from 'src/theme/spacers';
import { colors, effects, text } from 'src/theme';
import { useDeviceSize } from 'src/theme/hooks/useDeviceSize';
import { getCollaboratorsByPlatform } from './resources';
import { CollaboratorRecord } from 'dstnd-io';
import {
  toStreamerCollectionByRank,
  useGetStreamerCollectionWithLiveStatus,
} from './twitchSDK/useGetStreamerCollectionWithLiveStatus';
import { Hr } from 'src/components/Hr';
import { Avatar } from 'src/components/Avatar';
import { CollaboratorAsStreamer } from './types';
import { console } from 'window-or-global';
import { Text } from 'src/components/Text';

type Props = {};

const toCollaboratorStreamer = (
  c: CollaboratorRecord,
  isLive: boolean
): CollaboratorAsStreamer => ({
  ...c,
  isLive,
});

export const LivePage: React.FC<Props> = (props) => {
  const cls = useStyles();
  const deviceSize = useDeviceSize();
  const [streamers, setStreamers] = useState<CollaboratorAsStreamer[]>([]);

  useEffect(() => {
    getCollaboratorsByPlatform({
      platform: 'Twitch',
      pageSize: 10,
      currentIndex: 0,
    }).map((r) => {
      setStreamers(r.items.map((c) => toCollaboratorStreamer(c, false)));
    });
  }, []);

  // const streamersCollection = useGetStreamerCollectionWithLiveStatus(streamers);
  const streamersCollection = toStreamerCollectionByRank(streamers);

  console.log('streamersCollection', streamersCollection);

  return (
    <Page name="Live">
      {streamersCollection.featured && (
        <div className={cls.container}>
          <div className={cls.main}>
            <AspectRatio aspectRatio={{ width: 16, height: 9 }}>
              <ReactTwitchEmbedVideo
                channel={streamersCollection.featured.profileUrl}
                layout="video"
                height="100%"
                width="100%"
                targetClass={cls.videoContainer}
                targetId={streamersCollection.featured.profileUrl}
              />
            </AspectRatio>
            <div
              style={{
                paddingTop: spacers.default,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <div
                  style={{
                    paddingRight: spacers.default,
                  }}
                >
                  <Avatar imageUrl={streamersCollection.featured.profilePicUrl || ''} size="60px" />
                </div>
                <div>
                  <h2
                    style={{
                      marginTop: 0,
                    }}
                  >
                    {streamersCollection.featured.profileUrl}
                  </h2>
                </div>
              </div>
              <Hr />
            </div>
            <div
              style={{
                height: spacers.large,
              }}
            />
            <div className={cls.streamerCollectionListMask}>
              <h3>Weekly Featured</h3>
              <div className={cls.streamerCollectionList}>
                {streamersCollection.restInRankedOrder.map((s) => (
                  <div
                    className={cls.aspect}
                    style={{
                      overflow: 'hidden',
                      // backgroundColor: '#ededed',
                      // borderRadius: '16px',
                    }}
                  >
                    <a href={`https://twitch.tv/p${s.profileUrl}`} target="_blank">
                      {/* <AspectRatio
                        aspectRatio={{ width: 4, height: 3 }}
                        // className={cls.aspect}
                        // onClick={() => setStreamersCollection(getStreamers(s.twitch))}
                      > */}
                        <div style={{
                          display: 'flex',
                          flexDirection: 'row',
                        }}>
                          <Avatar imageUrl={s.profilePicUrl || ''} size="60px" />
                          <div>
                            <Text size="subtitle1" style={{
                              color: text.baseColor,
                            }}>{s.profileUrl}</Text>
                          </div>
                        </div>
                        {/* <div style={{}}> */}
                        {/* <img src={s.profilePicUrl} width="100%" /> */}
                        {/* </div> */}
                        {/* <ReactTwitchEmbedVideo
                        channel={s.profileUrl}
                        layout="video"
                        height="100%"
                        width="100%"
                        targetClass={cls.videoContainer}
                        targetId={s.profilePicUrl}
                        autoplay={false}
                      /> */}
                      {/* </AspectRatio> */}
                    </a>
                  </div>
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
                {streamersCollection.featured.isLive && (
                  <iframe
                    src={`https://www.twitch.tv/embed/${streamersCollection.featured.profileUrl}/chat?parent=localhost`}
                    height="65%"
                    width="100%"
                    className={cls.chatContainer}
                  />
                )}
              </div>
            </>
          )}
        </div>
      )}
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
    backgroundColor: '#ededed',
    borderRadius: '16px',
    overflow: 'hidden',

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
