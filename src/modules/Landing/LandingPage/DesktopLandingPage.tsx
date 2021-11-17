import React, { useEffect, useState } from 'react';
import { Page } from 'src/components/Page';
import { createUseStyles, makeImportant, NestedCSSElement } from 'src/lib/jss';
import { onlyDesktop, softBorderRadius, effects } from 'src/theme';
import { CreateRoomButtonWidget } from 'src/modules/Room/widgets/CreateRoomWidget/CreateRoomButtonWidget';
import { spacers } from 'src/theme/spacers';
import { useBodyClass } from 'src/lib/hooks/useBodyClass';
import { LiveHero } from 'src/modules/Live/widgets/LiveHero';
import { Text } from 'src/components/Text';
import { Resources } from 'dstnd-io';
import { PeerAvatar } from 'src/providers/PeerProvider';
import { getUserDisplayName } from 'src/modules/User';
import DiscordReactEmbed from '@widgetbot/react-embed';
import { getFeaturedStreamers } from 'src/modules/Live/resources';
import { AwesomeCountdown } from 'src/components/AwesomeCountdown/AwesomeCountdown';
import { toISODateTime } from 'io-ts-isodatetime';
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

type Props = {};

const HARDCODED_WCC_DEADLINE = toISODateTime(new Date('24 November 2021 13:00:00'));

export const DesktopLandingPage: React.FC<Props> = () => {
  const cls = useStyles();
  useBodyClass([cls.indexBackground]);
  const user = useAnyUser();

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
        toWatch: items.slice(1, 4),
      });
    });
  }, []);

  const [topPlayers, setTopPlayers] = useState<Resources.AllRecords.Game.PlayerGamesCountStat[]>(
    []
  );
  const [gameOfDay, setGameOfDay] = useState<Game>();

  useEffect(() => {
    getGameOfDay().map(gameRecordToGame).map(setGameOfDay);
    getTopPlayersByGamesCount().map(setTopPlayers);
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
          <div>
            <Text size="subtitle2" className={cls.title}>
              Top Players
            </Text>
            <div style={{ height: spacers.default }} />
            {topPlayers.map((r) => (
              <div
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
          {gameOfDay && (
            <>
              <div style={{ height: spacers.large }} />
              <Text size="subtitle2" className={cls.title}>
                Game of the Day
              </Text>
              <div style={{ height: spacers.default }} />
              <ChessGameDisplay game={gameOfDay} className={cls.board} />
            </>
          )}
        </aside>
        <main className={cls.main}>
          {streamers?.featured && <LiveHero featuredStreamer={streamers.featured} />}
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
            {/* <InfoCard
              top={
                null
                // <AspectRatio
                //   aspectRatio={{ width: 16, height: 9 }}
                //   style={{
                //     overflow: 'hidden',
                //     position: 'relative',
                //   }}
                // >
                //   <img
                //     src="https://partner.chessroulette.live/images/hero_b.png"
                //     style={{
                //       width: '100%',
                //       height: '100%',
                //     }}
                //   />
                // </AspectRatio>
              }
              bottom={
                <>
                  <Text size="title2">WCC Countdown</Text>
                  <div className={cls.verticalSpacer} />
                  <AwesomeCountdown deadline={HARDCODED_WCC_DEADLINE} fontSizePx={50} />
                </>
              }
            /> */}
            <FloatingBox className={cls.floatingBox}>
              <div className={cls.textGradient}>
                <Text size="title2">WCC Countdown</Text>
                <AwesomeCountdown deadline={HARDCODED_WCC_DEADLINE} fontSizePx={50} />
              </div>
            </FloatingBox>
            <div className={cls.verticalSpacer} />
          </div>
          <div
            style={{
              flex: 1,
            }}
          >
            <DiscordReactEmbed
              server="831348870218776686"
              channel="868596131481931796"
              style={{
                height: '100%',
                width: '100%',
              }}
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
    // background: 'purple',
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
    // height: '100vh',

    // background: 'red',
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

  topPlayerStats: {
    color: theme.text.subtle,
  },

  board: {
    ...softBorderRadius,
    overflow: 'hidden',
  },

  liveStream: {
    flex: 1,
    '&:first-child': {
      marginLeft: 0,
    },
  },

  userProfileShowcase: {
    ...effects.hardBorderRadius,
  },

  title: {
    color: theme.colors.primary,
  },

  textGradient: {
    backgroundImage: `linear-gradient(45deg, ${
      theme.name === 'darkDefault' ? theme.colors.positiveLight : theme.colors.primary
    } 0, #fff 150%)`,
    ...({
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
      // 'backgroundClip': 'text',
      // textFillColor: 'transparent',
    } as NestedCSSElement),
  },
}));
