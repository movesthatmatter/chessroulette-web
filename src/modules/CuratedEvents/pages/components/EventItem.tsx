import React from 'react';
import { AnchorLink } from 'src/components/AnchorLink';
import { createUseStyles } from 'src/lib/jss';
import { effects, softBorderRadius } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { CuratedEvent } from '../../types';
import cx from 'classnames';
import dateFormat from 'dateformat';
import { Text } from 'src/components/Text';
import { colors } from 'src/theme/colors';
import {Play} from 'react-iconly';

type Props = {
  event: CuratedEvent
};

export const EventItem: React.FC<Props> = ({event}) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
          <div
            className={cls.date}
          >
            <Text style={{ textAlign: 'center' }} size="tiny2">
              {dateFormat(new Date().getMonth(), 'mmm')}
            </Text>
            <Text style={{ textAlign: 'center' }} size="subtitle1">
              {dateFormat(new Date().getDay(), 'dd')}
            </Text>
          </div>
      <Text size='title2' className={cls.title}>{event.name}</Text>
      <div style={{flex: 1}}/>
      <AnchorLink href={`/events/${event.slug}`}><Play primaryColor={colors.universal.white}/></AnchorLink>
    </div>
  );
};

const useStyles = createUseStyles(theme => ({
  container: {
    background: theme.colors.primary,
    ...effects.hardBorderRadius,
    maxWidth: '650px',
    padding: spacers.default,
    marginBottom: spacers.default,
    display: 'flex'
  },
  date: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: colors.universal.white,
    ...softBorderRadius,
    color: colors.universal.black,
    padding: spacers.small,
    width: '2em',
    height: '2em',
    marginRight: spacers.small
  },
  title: {
    color: colors.universal.white
  }
}));