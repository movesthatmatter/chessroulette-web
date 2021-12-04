import React from 'react';
import { Page } from 'src/components/Page';
import chessBackground from './assets/chess_icons.png';
import darkChessBackground from './assets/dark_splash.svg';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { minMediaQuery, maxMediaQuery, onlyMobile, onlySmallMobile } from 'src/theme';
import { fonts } from 'src/theme/fonts';
import { Emoji } from 'src/components/Emoji';
import { CreateRoomButtonWidgetWithWizard } from 'src/modules/Room/widgets/CreateRoomWidget';
import { spacers } from 'src/theme/spacers';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { Button } from 'src/components/Button';

type Props = {};

export const MobileLandingPage: React.FC<Props> = (props) => {
  const cls = useStyles();
  const { theme } = useColorTheme();

  return (
    <Page
      name="Home"
      contentClassName={cls.pageContent}
      containerClassname={cls.pageContainer}
      stretched
    >
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
            <CreateRoomButtonWidgetWithWizard
              label="Play"
              type="primary"
              createRoomSpecs={{
                type: 'private',
                activityType: 'play',
              }}
              className={cls.playButton}
              size="medium"
              style={{
                marginRight: spacers.default,
              }}
            />

            <Button
              type={'primary'}
              clear
              label="Join Our Discord"
              size="medium"
              onClick={() => {
                window.open('https://discord.gg/XT7rvgsH66');
              }}
            />
            {/* <LichessChallengeButton label="Lichess" size="small" type="secondary" /> */}
          </div>
        </div>
      </div>
    </Page>
  );
};

const tabletBreakPoint = 600;

const useStyles = createUseStyles((theme) => ({
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
}));
