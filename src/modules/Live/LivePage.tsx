import React, { useEffect, useState } from 'react';
import { Page } from 'src/components/Page';
import { createUseStyles, NestedCSSElement } from 'src/lib/jss';
import { AspectRatio } from 'src/components/AspectRatio';
import ReactTwitchEmbedVideo from 'react-twitch-embed-video';
import { spacers } from 'src/theme/spacers';
import { darkTheme, effects, lightTheme, onlyDesktop } from 'src/theme';
import { getCollaboratorsByPlatform } from './resources';
import { CollaboratorRecord } from 'dstnd-io';
import { toStreamerCollectionByRank } from './twitchSDK/useGetStreamerCollectionWithLiveStatus';
import { Hr } from 'src/components/Hr';
import { Avatar } from 'src/components/Avatar';
import { CollaboratorAsStreamer } from './types';
import { Text } from 'src/components/Text';
import { AnchorLink } from 'src/components/AnchorLink';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';

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
  const [streamers, setStreamers] = useState<CollaboratorAsStreamer[]>([]);
  const {themeName} = useColorTheme();

  useEffect(() => {
    getCollaboratorsByPlatform({
      platform: 'Twitch',
      pageSize: 10,
      currentIndex: 0,
    }).map((r) => {
      setStreamers(r.items.map((c) => toCollaboratorStreamer(c, false)));
    });
  }, []);

  const streamersCollection = toStreamerCollectionByRank(streamers);

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
                paddingTop: spacers.larger,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  paddingBottom: spacers.large,
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
                  <AnchorLink
                    href={`https://twitch.tv/${streamersCollection.featured.profileUrl}`}
                    target="_blank"
                  >
                    <h3
                      style={{
                        marginTop: 0,
                        marginBlockEnd: '.2em',
                      }}
                    >
                      {streamersCollection.featured.profileUrl}
                    </h3>
                  </AnchorLink>
                  <Text size="body2">{streamersCollection.featured.about}</Text>
                  {` `}
                  <AnchorLink
                    href={`https://twitch.tv/${streamersCollection.featured.profileUrl}/about`}
                    target="_blank"
                  >
                    Learn More
                  </AnchorLink>
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
              <h3>Featured Collaborators</h3>
              <div className={cls.streamerCollectionList}>
                {streamersCollection.restInRankedOrder.map((s) => (
                  <div
                    className={cls.aspect}
                    style={{
                      overflow: 'hidden',
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
                        <AnchorLink href={`https://twitch.tv/${s.profileUrl}`} target="_blank">
                          <Avatar imageUrl={s.profilePicUrl || ''} size="60px" />
                        </AnchorLink>
                      </div>
                      <div>
                        <AnchorLink href={`https://twitch.tv/${s.profileUrl}`} target="_blank">
                          <Text asLink size="subtitle1">
                            {s.profileUrl}
                          </Text>
                        </AnchorLink>
                        <Text
                          size="body2"
                          asParagraph
                          style={{
                            marginTop: '.2em',
                            color: themeName ==='dark' ? darkTheme.text.baseColor : lightTheme.text.baseColor,
                          }}
                        >
                          {(s.about || '').length > 75 ? `${s.about?.slice(0, 75)}...` : s.about}
                          <br />
                          <AnchorLink
                            href={`https://twitch.tv/${s.profileUrl}/about`}
                            target="_blank"
                          >
                            Learn More
                          </AnchorLink>
                        </Text>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* // Chat will come later maybe */}
          {/* {deviceSize.isMobile || (
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
          )} */}
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
    flexDirection: 'column',

    ...onlyDesktop({
      flexDirection: 'row',
      flexWrap: 'wrap',
    }),
  },
  aspect: {
    ...onlyDesktop({
      width: `calc(${100 / 4}% - ${spacers.defaultPx * 2}px)`,
      marginRight: spacers.get(1.5),
      marginBottom: spacers.get(1.5),

      ...({
        '&:nth-child(3n)': {
          marginRight: 0,
        },
      } as NestedCSSElement),
    }),
  },
  chatContainer: {
    border: 0,
    borderRadius: '16px',
    overflow: 'hidden',
    ...effects.floatingShadow,
  },
});
