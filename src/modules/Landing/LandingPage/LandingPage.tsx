import React, { useEffect, useState } from 'react';
import { Page } from 'src/components/Page';
import chessBackground from './assets/chess_icons.png';
import darkChessBackground from './assets/dark_splash.svg';
import { createUseStyles, makeImportant, NestedCSSElement } from 'src/lib/jss';
import {
  minMediaQuery,
  maxMediaQuery,
  onlyMobile,
  onlySmallMobile,
  onlyDesktop,
  softBorderRadius,
  effects,
} from 'src/theme';
import { fonts } from 'src/theme/fonts';
import { Emoji } from 'src/components/Emoji';
import { CreateRoomButtonWidget } from 'src/modules/Room/widgets/CreateRoomWidget/CreateRoomButtonWidget';
import { spacers } from 'src/theme/spacers';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { useDeviceSize } from 'src/theme/hooks/useDeviceSize';
import { useBodyClass } from 'src/lib/hooks/useBodyClass';
import { Button } from 'src/components/Button';
import { LiveHero } from 'src/modules/Live/widgets/LiveHero';
import { ChessBoard } from 'src/modules/Games/Chess/components/ChessBoard';
import { getRandomInt, noop, range } from 'src/lib/util';
import { Text } from 'src/components/Text';
import { http } from 'src/lib/http';
import { console } from 'window-or-global';
import { CollaboratorRecord, UserInfoRecord } from 'dstnd-io';
import { PeerAvatar } from 'src/providers/PeerProvider';
import { getUserDisplayName } from 'src/modules/User';
import DiscordReactEmbed from '@widgetbot/react-embed';
import { CollaboratorAsStreamer, StreamerCollection } from 'src/modules/Live/types';
import { getCollaboratorsByPlatform } from 'src/modules/Live/resources';
import { toStreamerCollectionByRank } from 'src/modules/Live/twitchSDK/useGetStreamerCollectionWithLiveStatus';
import { AnchorLink } from 'src/components/AnchorLink';
import { Avatar } from 'src/components/Avatar';
import { AwesomeCountdown } from 'src/components/AwesomeCountdown/AwesomeCountdown';
import { toISODateTime } from 'io-ts-isodatetime';
import { UserInfoMocker } from 'src/mocks/records';
import { AspectRatio } from 'src/components/AspectRatio';

type Props = {};

const toCollaboratorStreamer = (
  c: CollaboratorRecord,
  isLive: boolean
): CollaboratorAsStreamer => ({
  ...c,
  isLive,
});

const HARDCODED_WCC_DEADLINE = toISODateTime(new Date('24 November 2021 13:00:00'));

export const LandingPage: React.FC<Props> = () => {
  const cls = useStyles();
  const deviceSize = useDeviceSize();
  const { theme } = useColorTheme();

  useBodyClass([cls.indexBackground]);

  const [streamerCollection, setStreamerCollection] = useState<StreamerCollection>();

  useEffect(() => {
    getCollaboratorsByPlatform({
      platform: 'Twitch',
      pageSize: 10,
      currentIndex: 0,
    }).map((r) => {
      setStreamerCollection(
        toStreamerCollectionByRank(r.items.map((c) => toCollaboratorStreamer(c, false)))
      );
    });
  }, []);

  const renderedContent = (
    <div className={cls.inner}>
      <div
        style={{
          flex: 1,
          alignItems: 'flex-end',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <img
          src={theme.name === 'lightDefault' ? chessBackground : darkChessBackground}
          style={{
            width: '95%',
            margin: '0 auto',
            maxWidth: '500px',
          }}
          alt="Chessroulette Board"
        />
      </div>
      <div className={cls.rightSide}>
        <h1 className={cls.headerText}>Chessroulette</h1>
        <h2 className={cls.subheaderText}>Where Chess Meets Video</h2>

        <div className={cls.list}>
          <h3 className={cls.text}>Play with friends in a private room.</h3>
          <h3 className={cls.text}>P2P game analysis in sync for everyone.</h3>
          <h3 className={cls.text}>
            Face to Face. Live. Free. <Emoji symbol="😎" />
          </h3>
        </div>
        <div className={cls.buttonWrapper}>
          <CreateRoomButtonWidget
            label="Play"
            type="primary"
            createRoomSpecs={{
              type: 'private',
              activityType: 'play',
            }}
            className={cls.playButton}
            size={deviceSize.isDesktop ? 'small' : 'medium'}
            style={{
              marginRight: spacers.default,
            }}
          />

          {deviceSize.isDesktop ? (
            <CreateRoomButtonWidget
              label="Analyze"
              type="primary"
              clear
              withBadge={{
                text: 'New',
                color: 'negative',
                side: 'right',
              }}
              // clear
              size="small"
              createRoomSpecs={{
                type: 'private',
                activityType: 'analysis',
              }}
            />
          ) : (
            <>
              <Button
                type={'primary'}
                clear
                label="Join Our Discord"
                size="medium"
                onClick={() => {
                  window.open('https://discord.gg/XT7rvgsH66');
                }}
              />
            </>
          )}
          {/* <LichessChallengeButton label="Lichess" size="small" type="secondary" /> */}
        </div>
      </div>
    </div>
  );

  const [topPlayers, setTopPlayers] = useState<{ user: UserInfoRecord; gamesCount: number }[]>([]);

  useEffect(() => {
    const userInfoMocker = new UserInfoMocker();

    setTopPlayers(
      range(3)
        .map(() => userInfoMocker.record())
        .map((user) => ({
          user: {
            ...user,
            name: '23',
          },
          gamesCount: getRandomInt(3, 100),
        }))
    );
  }, []);

  // useEffect(() => {
  //   http.get('api/games/top-players').then(
  //     async (r) => {
  //       // console.log('result', r.data);
  //       // const data = await r.data;
  //       setTopPlayers(r.data);
  //     },
  //     (e) => {
  //       console.log('err', e);
  //     }
  //   );
  // }, []);

  return (
    <Page
      name="Home"
      contentClassName={cls.pageContent}
      containerClassname={cls.pageContainer}
      stretched
    >
      <div className={cls.containerLanding}>
        <aside
          style={{
            // background: 'red',
            marginRight: spacers.large,
            // width: '30%',
            flex: 0.25,
            height: '100%',
          }}
        >
          <div>
            {/* <h3 style={{
              lineHeight: 0,
            }}>WCC Countdown</h3> */}
            <Text size="subtitle1">WCC Countdown</Text>
            <AwesomeCountdown deadline={HARDCODED_WCC_DEADLINE} fontSizePx={50} />
          </div>
          <div style={{ height: spacers.default }} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <CreateRoomButtonWidget
              label="Play Now"
              type="primary"
              createRoomSpecs={{
                type: 'private',
                activityType: 'play',
              }}
              // className={cls.playButton}
              full
              // size={deviceSize.isDesktop ? 'small' : 'medium'}
              style={{
                marginRight: spacers.default,
              }}
            />
            <div style={{ width: spacers.default }} />
            <CreateRoomButtonWidget
              label="Analyze"
              type="primary"
              clear
              withBadge={{
                text: 'New',
                color: 'negative',
                side: 'right',
              }}
              full
              // clear
              // size="small"
              createRoomSpecs={{
                type: 'private',
                activityType: 'analysis',
              }}
            />
          </div>
          <div style={{ height: spacers.default }} />
          <div
            className={''}
            style={{
              flex: 1,
              width: '300px',
              // height: '520px',
            }}
          >
            <Text size="subtitle2">Top Players</Text>
            <div style={{ height: spacers.default }} />
            {topPlayers.map((r) => (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flex: 1,
                  width: '100%',
                  marginBottom: spacers.default,
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
                  {/* <div> */}
                  <Text size="small1">{getUserDisplayName(r.user)}</Text>
                </div>
                <Text size="small1" className={cls.topPlayerStats}>
                  {r.gamesCount} Games
                </Text>
                {/* </div> */}
              </div>
            ))}
          </div>
          <div style={{ height: spacers.large }} />
          <Text size="subtitle2">Game of the Day</Text>
          <div style={{ height: spacers.default }} />
          <ChessBoard
            size={300}
            id="1"
            pgn="1. e4 e5 2. Bc4 Bc5 3. c3 Nf6 4. d4 exd4 5. cxd4 Bb6 6. Nc3 O-O 7. Nge2 c6 8. Bd3 d5 9. e5 Ne8 10. Be3 f6 11. Qd2 fxe5 12. dxe5 Be6 13. Nf4 Qe7 14. Bxb6 axb6 15. O-O Nd7 16. Nxe6 Qxe6 17. f4 Nc7 18. Rae1 g6 19. h3 d4 20. Ne4 h6 21. b3 b5 22. g4 Nd5 23. Ng3 Ne3 24. Rxe3 dxe3 25. Qxe3 Rxa2 26. Re1 Qxb3 27. Qe4 Qe6 28. f5 gxf5 29. gxf5 Qd5 30. Qxd5+ cxd5 31. Bxb5 Nb6 32. f6 Rb2 33. Bd3 Kf7 34. Bf5 Nc4 35. Nh5 Rg8+ 36. Bg4 Nd2 37. e6+ Kg6 38. f7 Rf8 39. Nf4+ Kg7 40. Bh5 1-0"
            type="play"
            onMove={noop}
            canInteract={false}
            playableColor="white"
            coordinates={false}
            className={cls.board}
          />
        </aside>
        <main
          style={{
            // background: 'purple',
            // background: 'red',
            height: '100%',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {streamerCollection?.featured && <LiveHero featured={streamerCollection.featured} />}
          <div>
            <div
              style={{
                height: spacers.large,
              }}
            />
            <h3>Streamers to follow</h3>
            <div className={cls.streamerCollectionList}>
              {streamerCollection?.restInRankedOrder.map((s) => (
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
                          color: theme.text.baseColor,
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
        </main>
        <aside
          style={{
            // background: 'red',
            marginLeft: spacers.large,
            // width: '30%',
            flex: 0.4,
            height: '100%',
          }}
        >
          <div>
            <AspectRatio
              aspectRatio={{ width: 16, height: 9 }}
              style={{
                // backgroundImage: 'url(https://partner.chessroulette.live/images/hero_b.png)',
                // backgroundSize: 'cover',
                ...effects.softBorderRadius,
                overflow: 'hidden',
                marginBottom: spacers.large,
              }}
            >
              <img
                src="https://partner.chessroulette.live/images/hero_b.png"
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  height: '40px',
                  // width: '100%',
                  top: 5,
                  // bottom: 5,
                  left: 5,
                  right: 150,
                  // posi
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                    zIndex: 9,
                  }}
                >
                  <div
                    style={{
                      padding: spacers.small,
                    }}
                  >
                    <Text
                      size="subtitle1"
                      style={{
                        fontSize: '32px',
                      }}
                    >
                      Let's Collab
                    </Text>
                  </div>
                </div>
                <div
                  style={{
                    // width: '100%',
                    // height: '60px',
                    // background: 'white',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    top: 0,
                    // padding: spacers.default,
                    // filter: 'blur(2px)',
                    backdropFilter: 'blur(5px)',
                    backgroundColor: 'rgba(255, 255, 255, .15)',
                    border: `1px solid rgba(255, 255, 255, .1)`,

                    ...effects.softBorderRadius,
                    overflow: 'hidden',
                    // boxShadow: 'inset 0 0 2000px rgba(255, 255, 255, .5)',
                    // opacity: .2,
                  }}
                />
              </div>
            </AspectRatio>
          </div>
          <DiscordReactEmbed
            server="831348870218776686"
            channel="868596131481931796"
            style={{
              height: 'calc(100% - 240px)',
              width: '100%',
            }}
          />
        </aside>
        {/* <AspectRatio aspectRatio={{ width: 16, height: 9 }}>
          <ReactTwitchEmbedVideo
            channel={streamersCollection.featured.profileUrl}
            layout="video"
            height="100%"
            width="100%"
            targetClass={cls.videoContainer}
            targetId={streamersCollection.featured.profileUrl}
          />
        </AspectRatio> */}
      </div>
    </Page>
  );
};

const tabletBreakPoint = 600;
const desktopBreakPoint = 769;

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
    // flexDirection: 'column',
    // justifyContent: 'center',
    height: '100%',
    color: theme.text.baseColor,
    // fontSize: '32px',

    // background: 'red',

    // ...minMediaQuery(tabletBreakPoint, {
    //   fontSize: '40px',
    // }),

    // ...minMediaQuery(desktopBreakPoint, {
    //   fontSize: '60px',
    // }),
  },
  pageContent: {
    minHeight: '100vh',
  },
  inner: {
    display: 'flex',
    alignSelf: 'center',
    maxWidth: '100%',
    width: '1152px',

    ...maxMediaQuery(tabletBreakPoint, {
      flexDirection: 'column',
    }),
  },
  headerText: {
    margin: 0,
    fontSize: '110%',
    lineHeight: '140%',
    fontWeight: 800,

    ...onlyMobile({
      fontSize: '130%',
    }),
  },
  subheaderText: {
    marginTop: 0,
    fontSize: '60%',
    lineHeight: '100%',
    fontWeight: 400,

    ...onlyMobile({
      fontSize: '70%',
      marginBottom: '48px',
    }),
  },
  list: {},
  text: {
    ...fonts.body1,
    lineHeight: '1em',
    color: theme.colors.neutralDarkest,

    ...onlySmallMobile({
      fontSize: '12px',
    }),
  },
  buttonWrapper: {
    marginTop: '24px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',

    ...minMediaQuery(tabletBreakPoint, {
      marginTop: '48px',
      justifyContent: 'flex-start',
    }),

    ...onlyMobile({
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }),
  },
  rightSide: {
    flex: 1,
    textAlign: 'center',

    ...minMediaQuery(tabletBreakPoint, {
      alignSelf: 'center',
      textAlign: 'left',
    }),
  },
  noMobileDisclaimerText: {
    fontSize: '40%',
    lineHeight: '40%',
  },
  desktopOnly: {
    ...maxMediaQuery(tabletBreakPoint, {
      display: 'none',
    }),
  },
  mobileOnly: {
    ...minMediaQuery(tabletBreakPoint, {
      display: 'none',
    }),
  },
  playButton: {
    ...makeImportant({
      background: theme.colors.primary,
      color: 'white',
    }),

    ...onlyMobile({
      ...makeImportant({
        marginRight: 0,
      }),
    }),
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
}));
