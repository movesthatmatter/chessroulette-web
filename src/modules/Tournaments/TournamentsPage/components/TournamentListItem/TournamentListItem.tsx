import React from 'react';
import { AnchorLink } from 'src/components/AnchorLink';
import { Button } from 'src/components/Button';
import { RelativeLink } from 'src/components/RelativeLink';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { TournamentRecord } from 'src/modules/Tournaments/types';
import { onlyMobile, softBorderRadius } from 'src/theme';
import { spacers } from 'src/theme/spacers';

type Props = {
  tournament: TournamentRecord;
  thumb: string;
};

export const TournamentListItem: React.FC<Props> = ({ tournament, thumb }) => {
  const cls = useStyles();

  return (
    <div className={cls.tournamentItem}>
      <AnchorLink href="https://fundraising-ukraine.chessroulette.live" target="_blank">
        <img src={thumb} className={cls.tournamentThumbImg} />
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
        <RelativeLink to={`/${tournament.id}`}>
          <Button label="Register or Learn More" onClick={() => {}} />
        </RelativeLink>
      </div>
    </div>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {},

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
