import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { CustomTheme, darkTheme, floatingShadow, hideOnMobile, lightTheme, onlyDesktop, softBorderRadius } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import cx from 'classnames';
import { Avatar } from 'src/components/Avatar';
import { Text } from 'src/components/Text';
import { GameRecordFinished, GameRecordStopped, RegisteredUserRecord } from 'dstnd-io';
import { Emoji } from 'src/components/Emoji';
import dateformat from 'dateformat';
import capitalize from 'capitalize';
import { MiniClipboardCopyButton } from 'src/components/ClipboardCopy';
import { otherChessColor } from 'dstnd-io/dist/chessGame/util/util';
import { getUserDisplayName } from 'src/modules/User';
import { drawEmoji, getMyResult, getScore, winningEmoji } from './util';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';

type Props = {
  game: GameRecordFinished | GameRecordStopped;
  myUserId?: RegisteredUserRecord['id'];
  containerClassName?: string;
  hasClipboardCopyButton?: boolean;
};

export const CompactArchivedGame: React.FC<Props> = ({
  game,
  myUserId,
  containerClassName,
  hasClipboardCopyButton = true,
}) => {
  const cls = useStyles();
  const avatarSize = '28px';
  const {theme, themeName} = useColorTheme();
  const colors = theme.colors;

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
      className={cx(cls.container, containerClassName)}
      style={{
        borderLeft: `4px solid ${colors.neutral}`,
        borderLeftColor,
      }}
    >
      <div className={cls.top}>
        <Text className={cls.title} size='small2'>
          {getScore(game)}
          {' | '}
          {capitalize(game.timeLimit)}
          {' | '}
          {dateformat(game.createdAt, 'yyyy-mm-dd')}
        </Text>
        {hasClipboardCopyButton && (
          <div className={cls.copyToClipboard}>
            <MiniClipboardCopyButton value={game.pgn} />
          </div>
        )}
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
              {/* <div className={cls.filler}>
                <Emoji
                  symbol={result === 'won' ? winningEmoji : result === 'lost' ? '' : drawEmoji}
                  className={cx(cls.emoji, cls.onlyDesktop)}
                />
              </div> */}
              <div className={cls.filler} />
              <div className={cx(cls.playerInfo, cls.playerInfoLeftSide)}>
                <Text
                  className={cls.playerName}
                  size="small2"
                  style={
                    result === 'won'
                      ? {
                          color: colors.primaryLight
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
          {themeName === 'light' && <Emoji symbol="⚡" className={cls.vsEmoji} />}
          {themeName === 'dark' && <FontAwesomeIcon icon={faBolt} color='white' size='sm'/>}
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
                    size="small2"
                    style={
                      result === 'won'
                        ? {
                            color:colors.primaryLight
                          }
                        : undefined
                    }
                  >
                    {getUserDisplayName(player.user)}
                  </Text>
                </div>
                <div className={cls.filler} />
                {/* <div className={cls.filler}>
                  <Emoji
                    symbol={result === 'won' ? winningEmoji : result === 'lost' ? '' : drawEmoji}
                    className={cx(cls.emoji, cls.onlyDesktop)}
                  />
                </div> */}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

const useStyles = createUseStyles<CustomTheme>(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: theme.colors.white,
    padding: spacers.small,
    ...theme.borders,
    ...softBorderRadius,
    ...theme.floatingShadow,
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
    color: theme.text.primaryColor
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
    color: theme.text.primaryColor
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
