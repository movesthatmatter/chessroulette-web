import React, { useMemo } from 'react';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import { fonts, hardBorderRadius, onlyDesktop, onlyMobile, softBorderRadius } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { CuratedEventRound } from '../../types';
import dateformat from 'dateformat';
import { colors } from 'src/theme/colors';
import { Text } from 'src/components/Text';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { RelayedGameRecord } from 'dstnd-io/dist/resourceCollections/relay/records';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChessPawn } from '@fortawesome/free-solid-svg-icons';
import { gameRecordToGame, getPlayerByColor } from 'src/modules/Games/Chess/lib';
import { formatTimeLimit, getScore } from 'src/modules/GamesArchive/components/ArchivedGame/util';
import capitalize from 'capitalize';
import { chessGameTimeLimitMsMap } from 'dstnd-io/dist/metadata/game';
import { Avatar } from 'src/components/Avatar';
import { Button } from 'src/components/Button';
import { ChessGameDisplay } from 'src/modules/Games/widgets/ChessGameDisplay';
import {
  ChessGameHistoryProvided,
  ChessGameHistoryProvider,
} from 'src/modules/Games/Chess/components/GameHistory';
import cx from 'classnames';
import { getUserDisplayName } from 'src/modules/User';
import { console } from 'window-or-global';
import { AnchorLink } from 'src/components/AnchorLink';
import { getRoundStatus } from './util';
import { Hoverable } from 'src/components/Hoverable';
import { Badge } from 'src/components/Badge';

type Props = {
  round: CuratedEventRound;
  // round: TournamentRound;
  active: boolean;
  onSelect: (r: CuratedEventRound) => void;
  // setDeactive: () => void;
  onLoadGame: (r: RelayedGameRecord) => void;
  onWatchNow: (r: RelayedGameRecord) => void;
};

// type BGColors = {
//   [k in RelayedGameRecord['gameState']]: CSSProperties['backgroundColor'];
// };

export const EventRound: React.FC<Props> = ({
  round,
  active,
  onSelect,
  // setDeactive,
  onLoadGame,
  onWatchNow,
}) => {
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

  const roundStatus = useMemo(() => {
    return getRoundStatus(round);
  }, [round]);

  const commentatorsList = useMemo(() => Object.values(round.commentators), [round.commentators]);

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
            : // ? `radial-gradient(135.59% 135.59% at 11.45% -9.26%, ${theme.colors.primary} 0%, ${theme.colors.background} 68.75%)`
              // : theme.name === 'darkDefault' ?  'radial-gradient(135.59% 135.59% at 11.45% -9.26%, #277F87 0%, #1B617B 20.83%, #161A2B 68.75%)' : theme.depthBackground.backgroundColor
              theme.depthBackground.backgroundColor,
      }}
      // onClick={() => {
      //   // if (round.relay.gameState !== 'pending' && !active) {
      //   //   setActive(round.id);
      //   // }
      //   // if (round.relay.gameState !== 'pending' && active) {
      //   //   setDeactive();
      //   // }
      // }}
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
        <div className={cls.title}>
          <Text size="body1" style={{ wordWrap: 'break-word' }}>
            {round.label}
          </Text>
          {/* {roundStatus} */}
        </div>
        <div className={cls.info}></div>
        <div className={cls.horizontalDivider}></div>
        <div className={cls.details}>
          {focusedGame && (
            <>
              {/* <span>{focusedGame.pgn}</span> */}
              {/* {focusedGame?.state === 'started' && ( */}
              {/* <div className={cls.top}>
                <Text size="tiny1">
                  <strong>
                    {formatTimeLimit(chessGameTimeLimitMsMap[focusedGame.timeLimit])})
                  </strong>{' '}
                  on <strong>{dateformat(focusedGame.createdAt, 'mmmm dd, yyyy HH:MM')}</strong>
                </Text>
              </div> */}
              {/* )} */}

              <div
                className={cls.playersContainer}
                style={
                  {
                    // ...(theme.name === 'lightDefault' && focusedGame.state === 'pending'
                    //   ? {
                    //       backgroundColor: '#4ea0e9',
                    //     }
                    //   : theme.name === 'lightDefault' &&
                    //     (focusedGame.state === 'finished' || focusedGame.state === 'stopped')
                    //   ? {
                    //       backgroundColor: '#b9c5d1',
                    //     }
                    //   : {}),
                  }
                }
              >
                <FontAwesomeIcon
                  icon={faChessPawn}
                  color={focusedGame.players[0].color}
                  size="sm"
                />
                <Text
                  size="subtitle2"
                  style={{
                    marginLeft: '5px',
                    color: colors.universal.white,
                  }}
                >
                  {focusedGame.players[0].user.name}
                </Text>
                {/* {round.relay.gameState === 'ended' && round.relay.game.winner === 'white' && (
            <FontAwesomeIcon icon={faTrophy} color="white" size="sm" />
          )} */}
                <div className={cls.horizontalDivider}>-</div>
                {/* {round.relay.gameState === 'ended' && round.relay.game.winner === 'black' && (
            <FontAwesomeIcon icon={faTrophy} color="white" size="sm" />
          )} */}
                <Text
                  size="subtitle2"
                  style={{
                    marginLeft: '5px',
                    color: colors.universal.white,
                  }}
                >
                  {focusedGame.players[1].user.name}
                </Text>
                <FontAwesomeIcon
                  icon={faChessPawn}
                  color={focusedGame.players[1].color}
                  size="sm"
                />
              </div>
              <div className={cls.horizontalDivider}></div>
            </>
          )}
          <div className={cls.horizontalDivider}></div>
          {/* {round.relay.gameState === 'started' && (
          <div
            className={cls.liveIcon}
            style={{
              position: 'absolute',
              right: -9,
              top: -6,
              zIndex: 9,
            }}
          />
        )} */}
        </div>
      </div>
      {/* <div className={cls.extra}>
        <div className={cls.gameWrapper}>
          {focusedGame && focusedGame.state === 'started' && (
            <ChessGameDisplay
              game={focusedGame}
              hoveredText="play"
              onClick={() => {
                console.log('works');
              }}
            />
          )}
        </div>
        <div className={''}>
          {commentatorsList.map((collaborator) => (
            <div
              style={{
                paddingRight: spacers.default,
              }}
            >
              <AnchorLink href={`/watch/${collaborator.username}`} target="_blank">
                <Avatar imageUrl={collaborator.profileImageUrl || ''} size={60} />
              </AnchorLink>
            </div>
          ))}
        </div>
      </div> */}
      {roundStatus === 'started' && (
        // <Badge
        //   color="primary"
        //   text="Live"
        //   className={cls.liveIcon}
        //   style={{
        //     position: 'absolute',
        //     right: '-9px',
        //     top: '-6px',
        //     zIndex: 9,
        //   }}
        // />
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
    // paddingLeft: spacers.small,
    // paddingRight: spacers.small,
    display: 'flex',
    // alignContent: 'start',
    marginBottom: spacers.large,

    // ...onlyDesktop({
    //   minWidth: '500px',
    //   maxWidth: '700px',
    // }),
    // ...onlyMobile({
    //   width: '100%',
    //   padding: spacers.default,
    // }),

    position: 'relative',
    ...theme.floatingShadow,
    // overflowY: 'hidden',
    '&:hover': {
      cursor: 'pointer',
    },
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
    // background: 'red'
  },
  extra: {},
  info: {
    // background: 'blue',
    flex: 1,
  },

  contentContainer: {
    display: 'flex',
  },
  horizontalSpacer: {
    width: spacers.default,
  },
  verticalSpacer: {
    height: spacers.small,
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
    margin: spacers.small,
    width: '2em',
    height: '2em',
    // alignSelf: 'center',
  },
  dateWhite: {
    backgroundColor: colors.universal.white,
    color: colors.universal.black,
  },
  dateDark: {
    backgroundColor: theme.colors.neutralDark,
    // color: theme.colors.neutralDark,
  },
  watch: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    ...softBorderRadius,
    padding: spacers.small,
    margin: spacers.small,
    width: '2em',
    height: '2em',
    // alignSelf: 'center',
  },
  title: {
    flex: '0 0 8em',
    display: 'flex',
    justifyItems: 'center',
    alignItems: 'center',
  },
  playersContainer: {
    display: 'flex',
    // flex: '0 0 20em',
    height: 'fit-content',
    flexDirection: 'row',
    ...softBorderRadius,
    padding: spacers.small,
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
  },
  liveIcon: {
    ...onlyDesktop({
      width: '20px',
      height: '20px',
      background: '#FF32A1',
      // boxSizing: 'border-box',
      // // borderRadius: '50%',
      borderRadius: '16px',
      border: `4px solid ${theme.colors.background}`,
    }),
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    marginRight: spacers.small,
    paddingTop: '8px',
    paddingBottom: '8px',
  },
  board: {
    ...softBorderRadius,
    overflow: 'hidden',
  },
  top: {
    display: 'flex',
    marginBottom: '8px',
    ...fonts.tiny1,
  },
  streamers: {
    display: 'flex',
    marginTop: spacers.small,
  },
  buttonContainer: {
    padding: spacers.small,
    margin: spacers.small,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
  },
  animationHeightOn: {
    animation: '$animateOn 0.4s',
  },
  animationHeightOff: {
    animation: '$animateOff 0.4s',
  },
  '@keyframes animateOn': {
    '0%': {
      height: '0px',
    },
    '100%': {
      height: '300px',
    },
  },
  '@keyframes animateOff': {
    '100%': {
      height: '0px',
    },
    '0%': {
      height: '300px',
    },
  },

  gameWrapper: {
    width: '260px',
  },
}));
