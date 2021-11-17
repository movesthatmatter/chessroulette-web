import React, { useEffect, useState } from 'react';
import { Page } from 'src/components/Page';
import { createUseStyles, NestedCSSElement } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import { effects, onlyDesktop } from 'src/theme';
import { getFeaturedStreamers } from './resources';
import { ResourceRecords } from 'dstnd-io';
import { Avatar } from 'src/components/Avatar';
import { Text } from 'src/components/Text';
import { AnchorLink } from 'src/components/AnchorLink';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { LiveHero } from './widgets/LiveHero';
import { TwitchChatEmbed } from 'src/vendors/twitch/TwitchChatEmbed';
import { LiveStreamCard } from './components/LiveStreamCard/LiveStreamCard';

type Props = {};

export const LivePage: React.FC<Props> = () => {
  const cls = useStyles();

  const { theme } = useColorTheme();

  const [streamers, setStreamers] = useState<{
    featured: ResourceRecords.Watch.LiveStreamerRecord;
    toWatch: ResourceRecords.Watch.LiveStreamerRecord[];
  }>();

  useEffect(() => {
    getFeaturedStreamers().map(({ items }) => {
      if (items.length === 0) {
        return;
      }

      setStreamers({
        featured: items[0],
        toWatch: items.slice(1),
      });
    });
  }, []);

  return (
    <Page name="Live" stretched>
      <div className={cls.container}>
        <main className={cls.main}>
          {streamers?.featured && (
            <>
              <LiveHero featuredStreamer={streamers.featured} />
              <div>
                <div style={{ height: spacers.get(3) }} />
                <Text size="title2" className={cls.title}>
                  Watch Now
                </Text>
                <div style={{ height: spacers.default }} />
                <div className={cls.streamerCollectionList}>
                  {streamers?.toWatch &&
                    streamers.toWatch.map((streamer, index) => (
                      <>
                        {index > 0 && <div style={{ width: spacers.large }} />}
                        <LiveStreamCard streamer={streamer} containerClassName={cls.liveStream} />
                      </>
                    ))}
                </div>
              </div>
              <div
                style={{
                  height: spacers.large,
                }}
              />
              <div className={cls.streamerCollectionListMask}>
                <h3>Featured Collaborators</h3>
                <div className={cls.streamerCollectionList}>
                  {streamers.toWatch.map((s) => (
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
                          <AnchorLink href={`https://twitch.tv/${s.username}`} target="_blank">
                            <Avatar imageUrl={s.profileImageUrl || ''} size={60} />
                          </AnchorLink>
                        </div>
                        <div>
                          <AnchorLink href={`https://twitch.tv/${s.username}`} target="_blank">
                            <Text asLink size="subtitle1">
                              {s.displayName}
                            </Text>
                          </AnchorLink>
                          <Text
                            size="body2"
                            asParagraph
                            style={{
                              marginTop: '.2em',
                              color: theme.text.baseColor,
                            }}
                          >
                            {s.description.length > 75
                              ? `${s.description?.slice(0, 75)}...`
                              : s.description}
                            <br />
                            <AnchorLink
                              href={`https://twitch.tv/${s.username}/about`}
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
            </>
          )}
        </main>
        <aside className={cls.rightSide}>
          {streamers?.featured && (
            <TwitchChatEmbed
              channel={streamers.featured.username}
              targetId={streamers.featured.username}
              height="100%"
              width="100%"
              targetClass={cls.chatContainer}
              theme={theme.name === 'darkDefault' ? 'dark' : 'light'}
            />
          )}
          <div className={cls.verticalSpacer} />
        </aside>
      </div>
    </Page>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  main: {
    flex: 1,
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
    ...(theme.name === 'darkDefault' ? effects.softFloatingShadowDarkMode : effects.floatingShadow),
  },

  rightSide: {
    height: 'calc(100vh - 94px - 32px)', // the top height
    paddingLeft: spacers.larger,
    flex: 0.3,
    minWidth: '320px',
    display: 'flex',
    flexDirection: 'column',
  },

  verticalSpacer: {
    height: spacers.larger,
  },

  title: {
    color: theme.colors.primary,
  },
  liveStream: {
    flex: 1,
    '&:first-child': {
      marginLeft: 0,
    },
  },
}));
