import React, { useMemo } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { hideOnMobile, onlyDesktop, softBorderRadius } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import cx from 'classnames';
import { Avatar } from 'src/components/Avatar';
import { Text } from 'src/components/Text';
import { GameRecord, RegisteredUserRecord } from 'dstnd-io';
import { Emoji } from 'src/components/Emoji';
import dateformat from 'dateformat';
import capitalize from 'capitalize';
import { MiniClipboardCopyButton } from 'src/components/ClipboardCopy';
import { getUserDisplayName } from 'src/modules/User';
import { getMyResult, getScore, hasWonByColor } from './util';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';

type Props = {
  game: GameRecord;
  myUserId?: RegisteredUserRecord['id'];
  containerClassName?: string;
  hasClipboardCopyButton?: boolean;
};

const avatarSize = 28;

export const CompactGameListItem: React.FC<Props> = ({
  game,
  myUserId,
  containerClassName,
  hasClipboardCopyButton = true,
}) => {
  const cls = useStyles();
  const { theme } = useColorTheme();
  const colors = theme.colors;

  const renderTitle = useMemo(() => {
    if (game.state === 'finished' || game.state === 'stopped') {
      return (
        <Text className={cls.title} size="small2">
          {getScore(game)}
          {' | '}
          {capitalize(game.timeLimit)}
          {' | '}
          {dateformat(game.createdAt, 'yyyy-mm-dd')}
        </Text>
      );
    }

    return (
      <Text className={cls.title} size="small2">
        {game.state === 'started' ? 'Ongoing' : 'Waiting'}
        {' | '}
        {capitalize(game.timeLimit)}
        {' | '}
        {dateformat(game.createdAt, 'yyyy-mm-dd')}
      </Text>
    );
  }, [game.state, game.createdAt, game.timeLimit]);

  const borderLeftColor = useMemo(() => {
    if (game.state === 'stopped' || game.state === 'finished') {
      const myUserResult = myUserId ? getMyResult(game, myUserId) : undefined;
      return myUserResult
        ? {
            won: colors.positive,
            lost: colors.negative,
            draw: colors.attention,
          }[myUserResult]
        : colors.neutral;
    }

    return colors.neutral;
  }, [game.state]);

  const renderLeftPlayer = useMemo(() => {
    const player = game.players[0];
    const playerHasWon =
      (game.state === 'finished' || game.state === 'stopped') && hasWonByColor(game, player.color);

    return (
      <div className={cls.sidePart}>
        <div className={cls.filler} />
        <div className={cx(cls.playerInfo, cls.playerInfoLeftSide)}>
          <Text
            className={cls.playerName}
            size="small2"
            style={
              playerHasWon
                ? {
                    color: colors.primaryLight,
                  }
                : undefined
            }
          >
            {getUserDisplayName(player.user)}
          </Text>
          <Avatar mutunachiId={Number(player.user.avatarId)} size={avatarSize} />
        </div>
      </div>
    );
  }, [game, cls]);

  const renderRightPlayer = useMemo(() => {
    const player = game.players[1];
    const playerHasWon =
      (game.state === 'finished' || game.state === 'stopped') && hasWonByColor(game, player.color);

    return (
      <div className={cls.sidePart}>
        {(() => {
          const player = game.players[1];

          return (
            <>
              <div className={cx(cls.playerInfo, cls.playerInfoRightSide)}>
                <Avatar mutunachiId={Number(player.user.avatarId)} size={avatarSize} />
                <Text
                  className={cls.playerName}
                  size="small2"
                  style={
                    playerHasWon
                      ? {
                          color: colors.primaryLight,
                        }
                      : undefined
                  }
                >
                  {getUserDisplayName(player.user)}
                </Text>
              </div>
              <div className={cls.filler} />
            </>
          );
        })()}
      </div>
    );
  }, [game, cls]);

  return (
    <div
      className={cx(cls.container, containerClassName)}
      style={{
        borderLeftColor,
      }}
    >
      <div className={cls.top}>
        {renderTitle}
        {hasClipboardCopyButton && game.pgn && (
          <div className={cls.copyToClipboard}>
            <MiniClipboardCopyButton value={game.pgn} />
          </div>
        )}
      </div>
      <div className={cls.sideWrapper}>
        {renderLeftPlayer}
        <div className={cls.middleSide}>
          {theme.name === 'lightDefault' && <FontAwesomeIcon icon={faBolt} color="black" size="sm" />}
          {theme.name === 'darkDefault' && (
            <FontAwesomeIcon icon={faBolt} color="white" size="sm" />
          )}
        </div>
        {renderRightPlayer}
      </div>
    </div>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: theme.colors.white,
    padding: spacers.small,
    borderLeft: `4px solid ${theme.colors.neutral}`,
   // ...theme.borders,
    ...softBorderRadius,
    ...theme.floatingShadow,
  },
  sideWrapper: {
    display: 'flex',
  },
  sidePart: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  middleSide: {
    width: spacers.larger,
    display: 'flex',
    alignItems: 'center',
    justifyItems: 'center',
    justifyContent: 'center',
  },
  filler: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyItems: 'center',
    justifyContent: 'center',
  },
  top: {
    paddingBottom: spacers.small,
    display: 'flex',
  },
  bottom: {
    paddingTop: spacers.default,
  },
  pgnWrapper: {
    ...onlyDesktop({
      width: '45%',
    }),
  },
  resultWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacers.default,
  },
  title: {
    flex: 1,
    color: theme.text.primaryColor,
  },
  copyToClipboard: {
    paddingLeft: spacers.small,
  },
  playerInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  playerInfoLeftSide: {
    textAlign: 'right',
  },
  playerInfoRightSide: {
    textAlign: 'left',
  },
  playerName: {
    paddingLeft: spacers.smaller,
    paddingRight: spacers.smaller,
    overflowWrap: 'anywhere',
    wordBreak: 'break-all',
    color: theme.text.primaryColor,
  },
  emoji: {
    fontSize: '26px',
  },
  vsEmoji: {
    fontSize: '24px',
  },
  onlyDesktop: {
    ...hideOnMobile,
  },
}));
