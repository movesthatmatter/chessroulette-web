import React, { useCallback, useEffect, useState } from 'react';
import { Page } from 'src/components/Page';
import { createUseStyles, NestedCSSElement } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import { effects, maxMediaQuery, onlyDesktop } from 'src/theme';
import {
  getCollaboratorsByPlatform,
  getCollaboratorStreamers,
  getFeaturedStreamers,
} from './resources';
import { CollaboratorRecord, ResourceRecords } from 'dstnd-io';
import { Avatar } from 'src/components/Avatar';
import { Text } from 'src/components/Text';
import { AnchorLink } from 'src/components/AnchorLink';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { LiveHero } from './widgets/LiveHero';
import { TwitchChatEmbed } from 'src/vendors/twitch/TwitchChatEmbed';
import { LiveStreamCard } from './components/LiveStreamCard/LiveStreamCard';
import { toDictIndexedBy } from 'src/lib/util';
import { console } from 'window-or-global';

type Props = {};

export const LivePage: React.FC<Props> = () => {
  const cls = useStyles();

  const { theme } = useColorTheme();

  const [streamers, setStreamers] = useState<{
    itemsById: Record<
      ResourceRecords.Watch.LiveStreamerRecord['id'],
      ResourceRecords.Watch.LiveStreamerRecord
    >;
    inFocus: ResourceRecords.Watch.LiveStreamerRecord['id'];
    toWatch: ResourceRecords.Watch.LiveStreamerRecord['id'][];
  }>();

  const [collaboratorStreamers, setCollaboratorStreamers] = useState<
    ResourceRecords.Watch.StreamerRecord[]
  >();

  useEffect(() => {
    console.log('streamers', streamers);
  }, [streamers]);

  useEffect(() => {
    getCollaboratorStreamers().map((s) => {
      setCollaboratorStreamers(s.items);
    });
  }, []);

  useEffect(() => {
    getFeaturedStreamers().map(({ items }) => {
      if (items.length === 0) {
        return;
      }

      const first4InOrder = items
        .slice(0, 5)
        .sort((a, b) => b.stream.viewerCount - a.stream.viewerCount);

      setStreamers({
        itemsById: toDictIndexedBy(first4InOrder, ({ id }) => id),
        inFocus: first4InOrder[0].id,
        toWatch: first4InOrder.slice(1, 5).map(({ id }) => id),
      });
    });
  }, []);

  const refocusStreamers = useCallback(
    (nextFocusId: ResourceRecords.Watch.LiveStreamerRecord['id']) => {
      setStreamers((prev) => {
        if (!prev) {
          return undefined;
        }

        if (!prev.itemsById[nextFocusId]) {
          return prev;
        }

        return {
          ...prev,
          inFocus: nextFocusId,
          toWatch: Object.values(prev.itemsById)
            .sort((a, b) => b.stream.viewerCount - a.stream.viewerCount)
            .filter(({ id }) => id !== nextFocusId)
            .map(({ id }) => id),
        };
      });
    },
    [setStreamers]
  );

  return (
    <Page name="Live" stretched>
      <div className={cls.container}>
        <main className={cls.main}>
          {streamers?.inFocus && (
            <>
              <LiveHero featuredStreamer={streamers.itemsById[streamers.inFocus]} muted={false} />
              <div>
                <div style={{ height: spacers.get(3) }} />
                <Text size="title2" className={cls.title}>
                  Watch Now
                </Text>
                <div className={cls.streamerCollectionList}>
                  {streamers?.toWatch &&
                    streamers.toWatch.map((streamerId, index) => (
                      <React.Fragment key={streamerId}>
                        {index > 0 && <div style={{ width: spacers.large }} />}
                        <LiveStreamCard
                          streamer={streamers.itemsById[streamerId]}
                          containerClassName={cls.liveStream}
                          onClick={() => refocusStreamers(streamerId)}
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
          {streamers?.inFocus && (
            <TwitchChatEmbed
              channel={streamers.itemsById[streamers.inFocus].username}
              targetId={streamers.itemsById[streamers.inFocus].username}
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
