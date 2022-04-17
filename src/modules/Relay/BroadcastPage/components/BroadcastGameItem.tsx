import React, { useMemo } from 'react';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import { fonts, hardBorderRadius, onlyDesktop, onlyMobile, softBorderRadius } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { TournamentRound } from '../types';
import dateformat from 'dateformat';
import { colors } from 'src/theme/colors';
import { Text } from 'src/components/Text';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { RelayedGameRecord } from 'chessroulette-io/dist/resourceCollections/relay/records';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChessPawn, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { gameRecordToGame, getPlayerByColor } from 'src/modules/Games/Chess/lib';
import { formatTimeLimit, getScore } from 'src/modules/GamesArchive/components/ArchivedGame/util';
import capitalize from 'capitalize';
import { chessGameTimeLimitMsMap } from 'chessroulette-io/dist/metadata/game';
import { Avatar } from 'src/components/Avatar';
import { Button } from 'src/components/Button';
import { ChessGameDisplay } from 'src/modules/Games/widgets/ChessGameDisplay';
import {
  ChessGameHistoryProvided,
  ChessGameHistoryProvider,
} from 'src/modules/Games/Chess/components/GameHistory';
import cx from 'classnames';

type Props = {
  round: TournamentRound;
  active: boolean;
  setActive: (id: string) => void;
  setDeactive: () => void;
  onLoadGame: (r: RelayedGameRecord) => void;
  onWatchNow: (r: RelayedGameRecord) => void;
};

type BGColors = {
  [k in RelayedGameRecord['gameState']]: CSSProperties['backgroundColor'];
};

export const BroadcastGameItem: React.FC<Props> = ({
  round,
  active,
  setActive,
  setDeactive,
  onLoadGame,
  onWatchNow,
}) => {
  const cls = useStyles();
  const { theme } = useColorTheme();

  const borderColor: BGColors = useMemo(
    () => ({
      ended: theme.colors.neutralDark,
      started: theme.colors.primary,
      pending: theme.colors.positive,
    }),
    [theme, cls]
  );

  return (
    <ChessGameHistoryProvider history={round.relay.game.history || []}>
      <div
        className={cls.container}
        style={{
          borderLeft: `4px solid ${borderColor[round.relay.gameState]}`,
          background:
            round.relay.gameState === 'ended'
              ? theme.depthBackground.backgroundColor
              : round.relay.gameState === 'started'
              ? `radial-gradient(135.59% 135.59% at 11.45% -9.26%, ${theme.colors.primary} 0%, ${theme.colors.background} 68.75%)`
              : // : theme.name === 'darkDefault' ?  'radial-gradient(135.59% 135.59% at 11.45% -9.26%, #277F87 0%, #1B617B 20.83%, #161A2B 68.75%)' : theme.depthBackground.backgroundColor
                theme.depthBackground.backgroundColor,
        }}
        onClick={() => {
          if (round.relay.gameState !== 'pending' && !active) {
            setActive(round.id);
          }
          if (round.relay.gameState !== 'pending' && active) {
            setDeactive();
          }
        }}
      >
        {round.relay.gameState === 'started' && (
          <div className={cls.buttonContainer}>
            <Text size="subtitle2" style={{ color: theme.colors.primary }}>
              LIVE
            </Text>
            <div className={cls.verticalSpacer} />
            <Button
              type="positive"
              label="Watch NOW"
              onClick={() => onWatchNow(round.relay)}
              style={{ marginBottom: '0px' }}
            />
          </div>
        )}
        {round.relay.gameState === 'pending' && (
          <div className={cls.date}>
            <Text style={{ textAlign: 'center' }} size="tiny2">
              {dateformat(round.date, 'ddd')}
            </Text>
            <Text style={{ textAlign: 'center' }} size="subtitle1">
              {dateformat(round.date, 'dd')}
            </Text>
          </div>
        )}
        <div className={cls.horizontalSpacer} />
        <div className={cls.title}>
          <Text size="body1" style={{ wordWrap: 'break-word' }}>
            {round.relay.label}
          </Text>
        </div>
        <div className={cls.horizontalDivider}></div>
        <div className={cls.details}>
          {round.relay.gameState !== 'started' && (
            <div className={cls.top}>
              <Text size="tiny1">
                <strong>
                  {(round.relay.game.state === 'finished' ||
                    round.relay.game.state === 'stopped') &&
                    `${getScore(round.relay.game)} -`}
                  {capitalize(round.relay.game.timeLimit)} (
                  {formatTimeLimit(chessGameTimeLimitMsMap[round.relay.game.timeLimit])})
                </strong>{' '}
                on <strong>{dateformat(round.relay.game.createdAt, 'mmmm dd, yyyy HH:MM')}</strong>
              </Text>
            </div>
          )}
          <div
            className={cls.playersContainer}
            style={{
              ...(theme.name === 'lightDefault' && round.relay.gameState === 'pending'
                ? {
                    backgroundColor: '#4ea0e9',
                  }
                : theme.name === 'lightDefault' && round.relay.gameState === 'ended'
                ? {
                    backgroundColor: '#b9c5d1',
                  }
                : {}),
            }}
          >
            <FontAwesomeIcon icon={faChessPawn} color="white" size="sm" />
            <Text
              size="subtitle2"
              style={{
                marginLeft: '5px',
                color:
                  round.relay.game.winner === 'white'
                    ? theme.colors.primary
                    : theme.name === 'lightDefault' && round.relay.gameState === 'started'
                    ? colors.universal.black
                    : colors.universal.white,
              }}
            >
              {getPlayerByColor('white', round.relay.game.players).user.name}
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
                color:
                  round.relay.game.winner === 'black'
                    ? theme.colors.primary
                    : theme.name === 'lightDefault' && round.relay.gameState === 'started'
                    ? colors.universal.black
                    : colors.universal.white,
              }}
            >
              {getPlayerByColor('black', round.relay.game.players).user.name}
            </Text>
            <FontAwesomeIcon icon={faChessPawn} color="black" size="sm" />
          </div>
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
          {round.streamers.length > 0 && round.relay.gameState !== 'ended' && (
            <div className={cls.streamers}>
              <div>
                <Text size="small2">Hosted by:</Text>
              </div>
              <div className={cls.horizontalSpacer} />
              {round.streamers.map((streamer) => (
                <div>
                  {/* <Text size="tiny1">
                  <strong>
                    {streamer.username}
                    {', '}
                  </strong>
                </Text> */}
                  <Avatar imageUrl={streamer.profileImageUrl || ''} size={20} />
                </div>
              ))}
            </div>
          )}
        </div>
        {round.relay.gameState === 'ended' && (
          <div className={cls.buttonContainer}>
            <Button
              type="secondary"
              label="Load Game"
              onClick={() => onLoadGame(round.relay)}
              style={{ marginBottom: '0px' }}
            />
          </div>
        )}
      </div>
      {active && (
        <div
          className={cx(cls.contentContainer, [
            active && cls.animationHeightOn,
            !active && cls.animationHeightOff,
          ])}
          style={{
            height: active ? '300px' : '0px',
            transition: 'all 0.4s linear',
          }}
        >
          <div style={{ flex: '0 0 12em' }}>
            <ChessGameDisplay
              game={gameRecordToGame(round.relay.game)}
              className={cls.board}
              thumbnail
            />
          </div>
          <div className={cls.horizontalSpacer} />
          <div
            style={{
              backgroundColor: theme.depthBackground.backgroundColor,
              padding: spacers.default,
              ...softBorderRadius,
              margin: spacers.default,
              flex: '0 0 12em',
            }}
          >
            <ChessGameHistoryProvided />
          </div>
        </div>
      )}
    </ChessGameHistoryProvider>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    ...hardBorderRadius,
    // padding: spacers.small,
    display: 'flex',
    marginBottom: spacers.large,
    ...onlyDesktop({
      minWidth: '500px',
      maxWidth: '700px',
    }),
    ...onlyMobile({
      width: '100%',
      padding: spacers.default,
    }),
    position: 'relative',
    ...theme.floatingShadow,
    overflowY: 'hidden',
    '&:hover': {
      cursor: 'pointer',
    },
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
    alignSelf: 'center',
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
    alignSelf: 'center',
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
      boxSizing: 'border-box',
      borderRadius: '50%',
      border: `3px solid ${theme.colors.background}`,
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
}));
