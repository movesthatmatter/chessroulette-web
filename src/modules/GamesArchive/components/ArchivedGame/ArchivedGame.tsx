import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import {
  CustomTheme,
  hideOnMobile,
  MOBILE_BREAKPOINT,
  onlyDesktop,
  softBorderRadius,
} from 'src/theme';
import { spacers } from 'src/theme/spacers';
import cx from 'classnames';
import { Avatar } from 'src/components/Avatar';
import { Text } from 'src/components/Text';
import { chessGameTimeLimitMsMap } from 'dstnd-io/dist/metadata/game';
import { GameRecordFinished, GameRecordStopped, RegisteredUserRecord } from 'dstnd-io';
import { Emoji } from 'src/components/Emoji';
import dateformat from 'dateformat';
import capitalize from 'capitalize';
import { ClipboardCopy, MiniClipboardCopyButton } from 'src/components/ClipboardCopy';
import { useWindowWidth } from '@react-hook/window-size';
import { otherChessColor } from 'dstnd-io/dist/chessGame/util/util';
import { getUserDisplayName } from 'src/modules/User';
import { drawEmoji, formatTimeLimit, getMyResult, getResult, getScore, winningEmoji } from './util';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faTrophy } from '@fortawesome/free-solid-svg-icons';

type Props = {
  game: GameRecordFinished | GameRecordStopped;
  myUserId?: RegisteredUserRecord['id'];
};

export const ArchivedGame: React.FC<Props> = ({ game, myUserId }) => {
  const cls = useStyles();
  const windowWidth = useWindowWidth();
  const {theme} = useColorTheme();
  const colors = theme.colors;

  const result = getResult(game);
  const avatarSize = windowWidth < MOBILE_BREAKPOINT ? '32px' : '72px';

  const myUserResult = myUserId ? getMyResult(game, myUserId) : undefined;
  const borderLeftColor = myUserResult
    ? {
        won: colors.positive,
        lost: colors.negative,
        draw: colors.attention,
      }[myUserResult]
    : colors.neutral;

  return (
    <div
      className={cls.container}
      style={{
        borderLeft: `4px solid ${colors.neutral}`,
        borderLeftColor,
      }}
    >
      <div className={cls.top}>
        <Text className={cls.title} size="subtitle1">
          {getScore(game)}{' | '}
          <strong>
            {capitalize(game.timeLimit)} ({formatTimeLimit(chessGameTimeLimitMsMap[game.timeLimit])}
            )
          </strong>{' '}
          played on <strong>{dateformat(game.createdAt, 'mmmm dd, yyyy HH:MM')}</strong>
        </Text>
        <div className={cls.copyToClipboard}>
          <MiniClipboardCopyButton value={game.pgn} />
        </div>
      </div>
      <div className={cls.sideWrapper}>
        {(() => {
          const player = game.players[0];
          const result = ({
            [player.color]: 'won',
            [otherChessColor(player.color)]: 'lost',
            '1/2': '1/2',
          } as const)[game.winner];

          return (
            <div className={cx(cls.side, cls.leftSide)}>
              <div className={cls.filler}>
                {theme.name === 'lightDefault' && <Emoji
                  symbol={result === 'won' ? winningEmoji : result === 'lost' ? '' : drawEmoji}
                  className={cx(cls.emoji, cls.onlyDesktop)}
                />}
                {theme.name === 'darkDefault' &&  result === 'won' && <FontAwesomeIcon icon={faTrophy} color='white' size='2x'/>}
              </div>
              <div className={cx(cls.playerInfo, cls.playerInfoLeftSide)}>
                <Text
                  className={cls.playerName}
                  style={
                    result === 'won'
                      ? {
                          fontWeight: 'bold',
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
        })()}
        <div className={cls.middleSide}>
          {theme.name === 'lightDefault' && <Emoji symbol="⚡" className={cls.vsEmoji}/>}
          {theme.name === 'darkDefault' && <FontAwesomeIcon icon={faBolt} color='white' size='1x'/>}
        </div>
        <div className={cx(cls.side, cls.rightSide)}>
          {(() => {
            const player = game.players[1];
            const result = ({
              [player.color]: 'won',
              [otherChessColor(player.color)]: 'lost',
              '1/2': '1/2',
            } as const)[game.winner];

            return (
              <>
                <div className={cx(cls.playerInfo, cls.playerInfoRightSide)}>
                  <Avatar mutunachiId={Number(player.user.avatarId)} size={avatarSize} />
                  <Text
                    className={cls.playerName}
                    style={
                      result === 'won'
                        ? {
                            fontWeight: 'bold',
                          }
                        : undefined
                    }
                  >
                    {getUserDisplayName(player.user)}
                  </Text>
                </div>
                <div className={cls.filler}>
                  {theme.name === 'lightDefault' &&  <Emoji
                    symbol={result === 'won' ? winningEmoji : result === 'lost' ? '' : drawEmoji}
                    className={cx(cls.emoji, cls.onlyDesktop)}
                  />}
                  {theme.name === 'darkDefault' &&  result === 'won' && <FontAwesomeIcon icon={faTrophy} color='white' size='2x'/>}
                </div>
              </>
            );
          })()}
        </div>
      </div>
      <div className={cls.bottom}>
        <div className={cls.resultWrapper}>
          <Text size="subtitle1">{result}</Text>
        </div>
        {/* <div className={cls.pgnWrapper}>
          <ClipboardCopy value={game.pgn} />
        </div> */}
      </div>
    </div>
  );
};

const useStyles = createUseStyles<CustomTheme>(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: theme.depthBackground.backgroundColor,
    padding: spacers.default,
    marginBottom: spacers.large,
    ...theme.borders,
    ...softBorderRadius,
    ...theme.floatingShadow
  },
  sideWrapper: {
    display: 'flex',
  },
  side: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  leftSide: {},
  rightSide: {},
  middleSide: {
    width: '60px',
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
    paddingBottom: spacers.default,
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
    // paddingBottom: spacers.default,
  },
  title: {
    flex: 1,
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
    paddingLeft: spacers.default,
    paddingRight: spacers.default,
  },
  emoji: {
    fontSize: '48px',
  },
  vsEmoji: {
    fontSize: '32px',
  },
  onlyDesktop: {
    ...hideOnMobile,
  },
}));
