import React, { useCallback, useEffect, useState } from 'react';
import { Page } from 'src/components/Page';
import { createUseStyles, makeImportant, NestedCSSElement } from 'src/lib/jss';
import { softBorderRadius, effects, hardBorderRadius } from 'src/theme';
import { CreateRoomButtonWidget } from 'src/modules/Room/widgets/CreateRoomWidget/CreateRoomButtonWidget';
import { spacers } from 'src/theme/spacers';
import { useBodyClass } from 'src/lib/hooks/useBodyClass';
import { LiveHero } from 'src/modules/Live/widgets/LiveHero';
import { Text } from 'src/components/Text';
import { Resources } from 'dstnd-io';
import { PeerAvatar } from 'src/providers/PeerProvider';
import { getUserDisplayName } from 'src/modules/User';
import DiscordReactEmbed from '@widgetbot/react-embed';
import { getCollaboratorStreamers, getFeaturedStreamers } from 'src/modules/Live/resources';
import { AwesomeCountdown } from 'src/components/AwesomeCountdown/AwesomeCountdown';
import { ResourceRecords } from 'dstnd-io';
import { LiveStreamCard } from 'src/modules/Live/components/LiveStreamCard/LiveStreamCard';
import { UserProfileShowcaseWidget } from 'src/modules/User/widgets/UserProfileShowcaseWidget';
import { useAnyUser } from 'src/services/Authentication';
import { Hr } from 'src/components/Hr';
import { Game } from 'src/modules/Games';
import { ChessGameDisplay } from 'src/modules/Games/widgets/ChessGameDisplay';
import { getGameOfDay, getTopPlayersByGamesCount } from './resources';
import { gameRecordToGame } from 'src/modules/Games/Chess/lib';
import { FloatingBox } from 'src/components/FloatingBox';
import { toDictIndexedBy } from 'src/lib/util';
import { AnchorLink } from 'src/components/AnchorLink';
import { Avatar } from 'src/components/Avatar';
import config from 'src/config';
import { getNextScheduledEvent, ScheduledEvent } from './schedule';
import { now } from 'src/lib/date';
import { addSeconds } from 'date-fns';
import { AspectRatio } from 'src/components/AspectRatio';
import { InfoCard } from 'src/components/InfoCard';

type Props = {};

export const DesktopLandingPage: React.FC<Props> = () => {
  const cls = useStyles();
  useBodyClass([cls.indexBackground]);
  const user = useAnyUser();

  const [streamers, setStreamers] = useState<{
    itemsById: Record<
      ResourceRecords.Watch.LiveStreamerRecord['id'],
      ResourceRecords.Watch.LiveStreamerRecord
    >;
    inFocus: ResourceRecords.Watch.LiveStreamerRecord['id'];
    toWatch: ResourceRecords.Watch.LiveStreamerRecord['id'][];
  }>();

  useEffect(() => {
    getFeaturedStreamers().map(({ items }) => {
      if (items.length === 0) {
        return;
      }

      const first4InOrder = items
        .slice(0, 4)
        .sort((a, b) => b.stream.viewerCount - a.stream.viewerCount);

      setStreamers({
        itemsById: toDictIndexedBy(first4InOrder, ({ id }) => id),
        inFocus: first4InOrder[0].id,
        toWatch: first4InOrder.slice(1, 4).map(({ id }) => id),
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

  const [topPlayers, setTopPlayers] = useState<Resources.AllRecords.Game.PlayerGamesCountStat[]>();
  const [gameOfDay, setGameOfDay] = useState<Game>();

  useEffect(() => {
    getGameOfDay().map(gameRecordToGame).map(setGameOfDay);

    // TODO: Add it back once the server works
    getTopPlayersByGamesCount().map(setTopPlayers);
  }, []);

  const [collaboratorStreamers, setCollaboratorStreamers] = useState<
    ResourceRecords.Watch.StreamerRecord[]
  >();

  useEffect(() => {
    getCollaboratorStreamers().map((s) => {
      setCollaboratorStreamers(s.items);
    });
  }, []);

  const [scheduledEvent, setScheduledEvent] = useState<ScheduledEvent>();

  useEffect(() => {
    getNextScheduledEvent(new Date()).then(setScheduledEvent);
  }, []);

  return (
    <Page
      name="Home"
      contentClassName={cls.pageContent}
      containerClassname={cls.pageContainer}
      stretched
    >
      <div className={cls.containerLanding}>
        <aside className={cls.leftSide}>
          {user && (
            <UserProfileShowcaseWidget
              className={cls.userProfileShowcase}
              callToActionComponent={() => (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    paddingTop: spacers.default,
                    flex: 1,
                    width: '100%',
                  }}
                >
                  <Hr text="Or Start making Progress" />
                  <br />
                  <CreateRoomButtonWidget
                    label="Play Now"
                    type="primary"
                    createRoomSpecs={{
                      type: 'private',
                      activityType: 'play',
                    }}
                    full
                    style={{
                      marginBottom: spacers.small,
                    }}
                  />
                  <div style={{ width: spacers.default }} />
                  <CreateRoomButtonWidget
                    label="Analyze"
                    type="secondary"
                    style={{
                      marginBottom: 0,
                    }}
                    full
                    createRoomSpecs={{
                      type: 'private',
                      activityType: 'analysis',
                    }}
                  />
                </div>
              )}
            />
          )}
          <div style={{ height: spacers.large }} />
          {topPlayers && (
            <div>
              <Text size="subtitle2" className={cls.title}>
                Top Players
              </Text>
              {topPlayers.map((r) => (
                <div
                  key={r.user.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flex: 1,
                    width: '100%',
                    marginBottom: spacers.large,
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flex: 1,
                      alignItems: 'center',
                    }}
                  >
                    <PeerAvatar peerUserInfo={r.user} />
                    <div style={{ width: spacers.small }} />
                    <Text size="small1">{getUserDisplayName(r.user)}</Text>
                  </div>
                  <Text size="small1" className={cls.topPlayerStats}>
                    {r.gamesCount} Games
                  </Text>
                </div>
              ))}
            </div>
          )}
          {gameOfDay && (
            <>
              <div style={{ height: spacers.large }} />
              <Text size="subtitle2" className={cls.title}>
                Game of the Day
              </Text>
              <ChessGameDisplay game={gameOfDay} className={cls.board} />
            </>
          )}
        </aside>
        <main className={cls.main}>
          {streamers?.inFocus && (
            <LiveHero featuredStreamer={streamers.itemsById[streamers.inFocus]} />
          )}
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
                      key={streamerId}
                      streamer={streamers.itemsById[streamerId]}
                      containerClassName={cls.liveStream}
                      onClick={() => refocusStreamers(streamerId)}
                    />
                  </React.Fragment>
                ))}
            </div>
          </div>
          {collaboratorStreamers && (
            <div>
              <div className={cls.verticalSpacer} />
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
                        {/* <div>
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
                              // color: theme.text.baseColor,
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
                        </div> */}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
        <aside
          className={cls.rightSide}
          style={{
            height: 'calc(100vh - 94px - 32px)', // the top height
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div>
            {scheduledEvent ? (
              <FloatingBox className={cls.floatingBox}>
                <div className={cls.textGradient}>
                  <Text size="title2">{scheduledEvent.eventName}</Text>
                  <AwesomeCountdown
                    deadline={scheduledEvent.timestamp}
                    fontSizePx={50}
                    onTimeEnded={async (tickInterval) => {
                      const next = await getNextScheduledEvent(
                        addSeconds(now(), tickInterval)
                      ).then(setScheduledEvent);

                      console.log('gonan get next', next);
                    }}
                  />
                </div>
              </FloatingBox>
            ) : (
              <InfoCard
                top={
                  <AspectRatio
                    aspectRatio={{ width: 16, height: 9 }}
                    style={{
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <img
                      src="https://partner.chessroulette.live/images/hero_b.png"
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  </AspectRatio>
                }
                bottom={
                  <AnchorLink href="https://partner.chessroulette.live" target="_blank">
                    <Text size="subtitle1">Let's Collaborate</Text>
                  </AnchorLink>
                }
              />
            )}
            <div className={cls.verticalSpacer} />
          </div>
          <div
            style={{
              flex: 1,
            }}
          >
            <DiscordReactEmbed
              server={config.DISCORD_SERVER_ID}
              channel={config.DISCORD_CHANNEL_ID}
              className={cls.discordWidget}
            />
          </div>
          <div className={cls.verticalSpacer} />
        </aside>
      </div>
    </Page>
  );
};

const useStyles = createUseStyles((theme) => ({
  indexBackground: {
    backgroundColor: theme.colors.background,
  },
  pageContainer: {
    ...makeImportant({
      ...(theme.name === 'lightDefault'
        ? {
            backgroundColor: theme.colors.background,
          }
        : {
            backgroundColor: '#27104e',
            backgroundImage: 'linear-gradient(19deg, #27104e 0%, #161a2b 25%)',
          }),
    }),
  },
  containerLanding: {
    display: 'flex',
    flex: 1,
    height: '100%',
    color: theme.text.baseColor,
  },
  pageContent: {
    minHeight: '100vh',
  },

  leftSide: {
    marginRight: spacers.larger,
    flex: 0.3,
    height: '100%',
  },
  rightSide: {
    marginLeft: spacers.larger,
    flex: 0.36,
  },

  main: {
    // height: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  verticalSpacer: {
    height: spacers.large,
  },

  floatingBox: {
    ...effects.hardBorderRadius,
  },

  streamerCollectionList: {
    display: 'flex',
    flexDirection: 'row',
  },
  aspect: {},

  topPlayerStats: {
    color: theme.text.subtle,
  },

  board: {
    ...softBorderRadius,
    overflow: 'hidden',
  },

  liveStream: {
    flex: 1,
    display: 'flex',
    // flexGrow: 0,
  },

  userProfileShowcase: {
    ...effects.hardBorderRadius,
  },

  title: {
    color: theme.colors.primary,
    marginBottom: '1em',
    display: 'block',
  },

  textGradient: {
    backgroundImage: `linear-gradient(45deg, ${
      theme.name === 'darkDefault' ? theme.colors.positiveLight : theme.colors.primary
    } 0, #fff 150%)`,
    ...({
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
    } as NestedCSSElement),
  },

  discordWidget: {
    width: '100%',
    height: '100%',
    ...makeImportant({
      background: theme.depthBackground.backgroundColor,
      ...hardBorderRadius,
      overflow: 'hidden',
    }),
  },
}));
