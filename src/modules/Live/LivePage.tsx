import React, { useEffect, useMemo, useState } from 'react';
import { Page } from 'src/components/Page';
import { createUseStyles } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import { effects, hideOnMobile } from 'src/theme';
import { getCollaboratorStreamers, getFeaturedStreamers } from './resources';
import { ResourceRecords } from 'dstnd-io';
import { Text } from 'src/components/Text';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { LiveHero } from './widgets/LiveHero';
import { TwitchChatEmbed } from 'src/vendors/twitch/TwitchChatEmbed';
import { toDictIndexedBy } from 'src/lib/util';
import { useHistory } from 'react-router-dom';
import { StreamsReel } from './components/StreamsReel';
import { StreamerGallery } from './components/StreamerGallery/StreamerGallery';
import { Streamer } from './types';
import { useDeviceSize } from 'src/theme/hooks/useDeviceSize';

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
  const [collaboratorStreamers, setCollaboratorStreamers] = useState<Streamer[]>();
  const device = useDeviceSize();

  const streamersToWatch = useMemo(() => {
    if (!streamersState) {
      return [];
    }

    return streamersState.toWatch.map((id) => streamersState.allByUsername[id]);
  }, [streamersState]);

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
    <Page name="Watch" stretched>
      <div className={cls.container}>
        <main className={cls.main}>
          {streamersState?.hero && (
            <>
              <LiveHero
                featuredStreamer={streamersState.allByUsername[streamersState.hero]}
                muted={false}
              />
              {streamersToWatch && (
                <div className={cls.section}>
                  <Text size="title2" className={cls.title}>
                    Watch Now
                  </Text>
                  <StreamsReel
                    streamers={streamersToWatch}
                    onItemClick={(s) => history.replace(`/watch/${s.username}`)}
                  />
                </div>
              )}
              {collaboratorStreamers && (
                <div className={cls.section}>
                  <Text size="title2" className={cls.title}>
                    Streamers to Follow
                  </Text>
                  <StreamerGallery
                    streamers={collaboratorStreamers}
                    itemsPerRow={device.isMobile ? 2 : 4}
                  />
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
  section: {
    paddingTop: spacers.larger,
  },

  videoContainer: {
    border: 0,
    backgroundColor: '#ededed',
    borderRadius: '16px',
    overflow: 'hidden',

    width: '100%',
    height: '100%',
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

    ...hideOnMobile,
  },

  verticalSpacer: {
    height: spacers.larger,
  },

  title: {
    color: theme.colors.primary,
    display: 'block',
    marginBottom: '1em',
  },
}));
