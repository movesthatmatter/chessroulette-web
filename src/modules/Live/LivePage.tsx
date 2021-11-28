import React, { useEffect, useState } from 'react';
import { Page } from 'src/components/Page';
import { createUseStyles, NestedCSSElement } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import { effects, onlyDesktop } from 'src/theme';
import { getCollaboratorStreamers, getFeaturedStreamers } from './resources';
import { ResourceRecords } from 'dstnd-io';
import { Avatar } from 'src/components/Avatar';
import { Text } from 'src/components/Text';
import { AnchorLink } from 'src/components/AnchorLink';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { LiveHero } from './widgets/LiveHero';
import { TwitchChatEmbed } from 'src/vendors/twitch/TwitchChatEmbed';
import { LiveStreamCard } from './components/LiveStreamCard/LiveStreamCard';
import { toDictIndexedBy } from 'src/lib/util';
import { useHistory } from 'react-router-dom';

type Props = {
  heroStreamer?: string;
};

type LiveStreamer = ResourceRecords.Watch.LiveStreamerRecord;

type LiveStreamerState = {
  allByUsername: Record<LiveStreamer['username'], LiveStreamer>;
  hero: LiveStreamer['username'];
  toWatch: LiveStreamer['username'][];
};

const toStreamersState = (
  streamers: LiveStreamer[],
  heroUsername?: string
): LiveStreamerState | undefined => {
  if (streamers.length === 0) {
    return undefined;
  }

  const streamersByUsername = toDictIndexedBy(streamers, (p) => p.username);

  const _heroUsername = streamersByUsername[heroUsername || '']?.username || streamers[0].username;

  const { [_heroUsername]: hero, ...rest } = streamersByUsername;

  return {
    allByUsername: streamersByUsername,
    hero: hero.username,
    toWatch: Object.values(rest).map((u) => u.username),
  };
};

export const LivePage: React.FC<Props> = (props) => {
  const cls = useStyles();
  const { theme } = useColorTheme();
  const [streamersState, setStreamersState] = useState<LiveStreamerState>();
  const [collaboratorStreamers, setCollaboratorStreamers] = useState<
    ResourceRecords.Watch.StreamerRecord[]
  >();

  useEffect(() => {
    getCollaboratorStreamers().map((s) => {
      setCollaboratorStreamers(s.items);
    });
  }, []);

  const history = useHistory();

  useEffect(() => {
    getFeaturedStreamers().map(({ items }) => {
      if (items.length === 0) {
        return;
      }

      const nextStremersState = toStreamersState(items, props.heroStreamer);

      if (props.heroStreamer && props.heroStreamer !== nextStremersState?.hero) {
        history.replace('/watch');
      }

      setStreamersState(nextStremersState);
    });
  }, [props.heroStreamer, history]);

  return (
    <Page name="Live" stretched>
      <div className={cls.container}>
        <main className={cls.main}>
          {streamersState?.hero && (
            <>
              <LiveHero
                featuredStreamer={streamersState.allByUsername[streamersState.hero]}
                muted={false}
              />
              <div>
                <div style={{ height: spacers.get(3) }} />
                <Text size="title2" className={cls.title}>
                  Watch Now
                </Text>
                <div className={cls.streamerCollectionList}>
                  {streamersState?.toWatch &&
                    streamersState.toWatch.map((streamerId, index) => (
                      <React.Fragment key={streamerId}>
                        {index > 0 && <div style={{ width: spacers.large }} />}
                        <LiveStreamCard
                          streamer={streamersState.allByUsername[streamerId]}
                          containerClassName={cls.liveStream}
                          onClick={() => {
                            // refocusStreamers(streamerId)
                            history.replace(
                              `/watch/${streamersState.allByUsername[streamerId].username}`
                            );
                          }}
                        />
                      </React.Fragment>
                    ))}
                </div>
              </div>
              <div
                style={{
                  height: spacers.large,
                }}
              />
              {collaboratorStreamers && (
                <div className={cls.streamerCollectionListMask}>
                  <Text size="title2" className={cls.title}>
                    Streamers to Follow
                  </Text>
                  <div className={cls.streamerCollectionList}>
                    {collaboratorStreamers.map((collaborator) => {
                      // const s = streamers.itemsById[streamerId];

                      return (
                        <div
                          key={collaborator.id}
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
                              <AnchorLink
                                href={`https://twitch.tv/${collaborator.username}`}
                                target="_blank"
                              >
                                <Avatar imageUrl={collaborator.profileImageUrl || ''} size={60} />
                              </AnchorLink>
                            </div>
                            <div>
                              <AnchorLink
                                href={`https://twitch.tv/${collaborator.username}`}
                                target="_blank"
                              >
                                <Text asLink size="subtitle1">
                                  {collaborator.displayName}
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
                                {collaborator.description.length > 75
                                  ? `${collaborator.description?.slice(0, 75)}...`
                                  : collaborator.description}
                                <br />
                                <AnchorLink
                                  href={`https://twitch.tv/${collaborator.username}/about`}
                                  target="_blank"
                                >
                                  Learn More
                                </AnchorLink>
                              </Text>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
        <aside className={cls.rightSide}>
          {streamersState?.hero && (
            <TwitchChatEmbed
              channel={streamersState.allByUsername[streamersState.hero].username}
              targetId={streamersState.allByUsername[streamersState.hero].username}
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
    display: 'block',
    marginBottom: '1em',
  },

  streamerCollectionListMask: {},
  streamerCollectionList: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  liveStream: {
    flex: 1,
    '&:first-child': {
      marginLeft: 0,
    },
    width: '33%',
  },
}));
