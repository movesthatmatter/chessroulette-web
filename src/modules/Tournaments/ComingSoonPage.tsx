import React from 'react';
import { AnchorLink } from 'src/components/AnchorLink';
import { GradientText } from 'src/components/GradientText';
import { Page } from 'src/components/Page';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { useAuthenticatedUser } from 'src/services/Authentication';
import { onlyMobile, softBorderRadius } from 'src/theme';
import { colors } from 'src/theme/colors';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { spacers } from 'src/theme/spacers';
import mtmUkraineFundraiserThumb from './images/mtm_ukraine_fundraiser_thumb_b.png';

type Props = {};

export const ComingSoonPage: React.FC<Props> = () => {
  const cls = useStyles();
  const user = useAuthenticatedUser();
  const theme = useColorTheme();

  return (
    <Page name="Tournaments Coming Soon">
      <div className={cls.container}>
        <div className={cls.upcomingContainer}>
          <GradientText
            gradientCSSProp={
              theme.theme.name === 'darkDefault'
                ? `linear-gradient(45deg, #FF32A1 0, #027EF4 32%, #98F371 76%, #D833D1 10%, #fff 100%)`
                : `linear-gradient(45deg, ${colors.light.primary} -5%, #EB00FF 125%)`
            }
          >
            <h1 className={cls.title}>Tournaments Coming Soon</h1>
          </GradientText>

          <div className={cls.subtitleWrapper}>
            <Text size="body1">We're currently building the tournaments feature. Stay tuned!</Text>
          </div>
        </div>
        <div className={cls.section}>
          <Text size="subtitle1">Upcoming Featured Tournaments</Text>
        </div>
        <br />
        <br />
        <div className={cls.tournamentItem}>
          <AnchorLink href="https://fundraising-ukraine.chessroulette.live" target="_blank">
            <img src={mtmUkraineFundraiserThumb} className={cls.tournamentThumbImg}></img>
          </AnchorLink>
          <div className={cls.tournamentItemInfo}>
            <Text size="title2">
              Moves That Matter Fundraising – Help The Children Of Ukraine Tournament
            </Text>
            <br />
            <br />
            <Text size="subtitle1">TBD in April 2022</Text>
            <br />
            <br />
            <Text size="body2">
              Join us for a Swiss Tournament to raise money for the children of Ukraine.
              <br />
              100% of the donations are going to UNICEF for Children.
              <br />
              <br />
            </Text>
            <Text size="subtitle1">Prizes</Text>
            <br />
            <Text size="body2">First and Second Place - One Of A Kind NFT</Text>
            <br />
            <Text size="body2">Every participant receives a Collectible NFT after the event.</Text>

            <br />
            <br />
            <AnchorLink href="https://fundraising-ukraine.chessroulette.live" target="_blank">
              Learn More
            </AnchorLink>
          </div>
        </div>
      </div>
    </Page>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {},
  upcomingContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100%',
  },
  title: {
    fontSize: '64px',
    fontWeight: 900,
    textAlign: 'center',
    marginBottom: '.5em',
  },
  lightThemeTitle: {
    color: colors.light.primary,
  },
  infoText: {
    display: 'block',
    paddingBottom: spacers.larger,
  },
  tournamentThumbImg: {
    maxWidth: '320px',
    ...softBorderRadius,
  },

  subtitleWrapper: {
    width: '50%',
    color: theme.text.subtle,
    textAlign: 'center',

    ...onlyMobile({
      width: '100%',
    }),
  },

  section: {
    paddingTop: '80px',
  },

  tournamentItem: {
    display: 'flex',

    ...onlyMobile({
      flexDirection: 'column',
      alignItems: 'center',
    }),
  },
  tournamentItemInfo: {
    paddingLeft: spacers.large,

    ...onlyMobile({
      paddingTop: spacers.large,
      paddingLeft: 0,
    }),
  },
}));
