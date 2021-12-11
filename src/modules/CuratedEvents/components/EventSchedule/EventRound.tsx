import React, { useMemo } from 'react';
import dateformat from 'dateformat';
import cx from 'classnames';
import { createUseStyles } from 'src/lib/jss';
import { fonts, hardBorderRadius, softBorderRadius } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { CuratedEventRound } from '../../types';
import { colors } from 'src/theme/colors';
import { Text } from 'src/components/Text';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { RelayedGameRecord } from 'dstnd-io/dist/resourceCollections/relay/records';
import { gameRecordToGame } from 'src/modules/Games/Chess/lib';
import { getRoundStatus } from './util';
import { GamePlayersHeadsOn } from 'src/modules/GamesArchive/components/GamePlayersHeadsOn';

type Props = {
  round: CuratedEventRound;
  active: boolean;
  onSelect: (r: CuratedEventRound) => void;
  onLoadGame: (r: RelayedGameRecord) => void;
  onWatchNow: (r: RelayedGameRecord) => void;
};

export const EventRound: React.FC<Props> = ({ round, onSelect }) => {
  const cls = useStyles();
  const { theme } = useColorTheme();

  const borderColor = useMemo(
    () =>
      ({
        finished: theme.colors.neutralDark,
        started: colors.light.primary,
        pending: theme.colors.primary,
      } as const),
    [theme, cls]
  );

  const focusedGame = useMemo(() => {
    const [firstGame, ...restGames] = round.games;

    if (!firstGame) {
      return undefined;
    }

    return gameRecordToGame(firstGame);
  }, [round]);

  const roundStatus = useMemo(() => getRoundStatus(round), [round]);

  return (
    <div
      className={cx(cls.container, focusedGame?.state === 'started' && cls.containerExpanded)}
      onClick={() => onSelect(round)}
      style={{
        borderLeft: `4px solid ${borderColor[roundStatus]}`,
        background:
          roundStatus === 'finished'
            ? theme.depthBackground.backgroundColor
            : roundStatus === 'started'
            ? `linear-gradient(45deg, ${colors.light.primary} 0, ${colors.dark.primary} 150%)`
            : theme.depthBackground.backgroundColor,
      }}
    >
      <div className={cls.main}>
        {roundStatus !== 'started' && (
          <div
            className={cx(
              cls.date,
              roundStatus === 'pending' && cls.dateWhite,
              roundStatus === 'finished' && cls.dateDark
            )}
          >
            <Text style={{ textAlign: 'center' }} size="tiny2">
              {dateformat(round.startingAt, 'mmm')}
            </Text>
            <Text style={{ textAlign: 'center' }} size="subtitle1">
              {dateformat(round.startingAt, 'dd')}
            </Text>
          </div>
        )}
        <div className={cls.horizontalSpacer} />
        <div className={cls.titleWrapper}>
          <Text size="body1" className={cls.title}>
            {round.label}
          </Text>
        </div>
        <div style={{ flex: 1 }} />
        <div className={cls.details}>
          {focusedGame && (
            <GamePlayersHeadsOn players={focusedGame.players} winner={focusedGame.winner} />
          )}
          <div className={cls.horizontalDivider}></div>
        </div>
      </div>

      {roundStatus === 'started' && (
        <div
          className={cls.liveIcon}
          style={{
            position: 'absolute',
            right: -9,
            top: -6,
            zIndex: 9,
          }}
        />
      )}
    </div>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    ...hardBorderRadius,
    display: 'flex',
    marginBottom: spacers.default,
    position: 'relative',
    ...theme.floatingShadow,
    '&:hover': {
      cursor: 'pointer',
    },
    padding: spacers.small,
  },
  containerExpanded: {
    paddingTop: spacers.default,
    paddingBottom: spacers.default,
    paddingRight: spacers.default,
  },
  main: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  info: {
    flex: 1,
  },
  horizontalSpacer: {
    width: spacers.default,
  },
  horizontalDivider: {
    width: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    ...fonts.small1,
  },
  date: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: theme.name === 'lightDefault' ? theme.colors.primary : colors.universal.white,
    ...softBorderRadius,
    color: theme.name === 'lightDefault' ? colors.universal.white : colors.universal.black,
    padding: spacers.small,
    width: '2em',
    height: '2em',
  },
  dateWhite: {
    backgroundColor: colors.universal.white,
    color: colors.universal.black,
  },
  dateDark: {
    backgroundColor: theme.colors.neutralDark,
  },
  titleWrapper: {
    display: 'flex',
    justifyItems: 'center',
    alignItems: 'center',
  },
  title: {
    wordWrap: 'break-word',
    textTransform: 'capitalize',
  },

  liveIcon: {
    width: '20px',
    height: '20px',
    background: '#FF32A1',
    borderRadius: '16px',
    border: `4px solid ${theme.colors.background}`,
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
  },
}));
