import React from 'react';
import { Button } from 'src/components/Button';
import { Link } from 'src/components/RelativeLink/Link';
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
      <Link to={`/tournaments/${tournament.id}`}>
        <img src={thumb} className={cls.tournamentThumbImg} />
      </Link>
      <div className={cls.tournamentItemInfo}>
        <Text size="title2">{tournament.name}</Text>
        <br />
        <br />
        <Text size="subtitle1">April 9th 2022, 2pm EST</Text>
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
        <Link to={`/tournaments/${tournament.id}`}>
          <Button label="View" onClick={() => {}} />
        </Link>
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
