import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { CustomTheme, fonts } from 'src/theme';
import { colors } from 'src/theme/colors';
import { getSizers } from 'src/theme/sizers';
import { spacers } from 'src/theme/spacers';

type Props = {};

export const NextBroadcasts: React.FC<Props> = (props) => {
  const cls = useStyles();

  function calculateDateDifference(date: string): string {
    const differenceInTime = new Date(date).getTime() - new Date().getTime();
    const differenceInHours = Math.abs(differenceInTime) / 36e5;
    if (differenceInHours < 1) {
      const differenceInMinutes = Math.floor(differenceInHours * 60);
      return `${differenceInMinutes} minutes`;
    }
    if (differenceInHours < 24 && differenceInHours > 1) {
      return `${differenceInHours} hours`;
    }
    const differenceInDays = Math.floor(differenceInHours / 24);

    return `${differenceInDays} days and ${Math.floor(
      differenceInHours - differenceInDays * 24
    )} hours`;
  }

  return (
    <div className={cls.container}>
      <div className={cls.title}>Next Broadcasts :</div>
      <div className={cls.entry}>
        <div className={cls.icon} />
        <div className={cls.subtitle}>WCC 2021 - Game 1</div>
        <div className={cls.spacer}>-</div>
        <div>{calculateDateDifference('November 26, 2021 06:30')}</div>
      </div>
    </div>
  );
};

const useStyles = createUseStyles<CustomTheme>((theme) => ({
  container: {},
  title: {
    ...fonts.title2,
    backgroundColor: theme.colors.primary,
    padding: getSizers().small,
    marginBottom: spacers.large,
    color: colors.universal.white,
  },
  subtitle: {
    fontWeight: 'bold',
    marginRight: spacers.large,
    color: theme.colors.primary,
  },
  spacer: {
    width: spacers.large,
  },
  entry: {
    ...fonts.body1,
    marginLeft: spacers.larger,
    display: 'flex',
  },
  icon: {
    width: '12px',
    height: '12px',
    background: theme.colors.primary,
    boxSizing: 'border-box',
    borderRadius: '50%',
    marginRight: spacers.default,
    alignSelf: 'center',
  },
}));
