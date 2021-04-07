import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import {
  colors,
  floatingShadow,
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
import HumanizeDuration from 'humanize-duration';
import { GameRecordFinished, GameRecordStopped, RegisteredUserRecord } from 'dstnd-io';
import { Emoji } from 'src/components/Emoji';
import { otherChessColor } from 'src/modules/Games/Chess/util';
import dateformat from 'dateformat';
import capitalize from 'capitalize';
import { ClipboardCopy } from 'src/components/ClipboardCopy';
import { useWindowWidth } from '@react-hook/window-size';

type Props = {
  game: GameRecordFinished | GameRecordStopped;
  myUserId?: RegisteredUserRecord['id'];
};

const formatTimeLimit = HumanizeDuration.humanizer({
  largest: 2,
  round: true,
});

const winningEmoji = '🏆';
const losingEmoji = '🥶';
const drawEmoji = '';

const getResult = (game: GameRecordFinished | GameRecordStopped) => {
  if (game.winner === '1/2') {
    return 'Game Ended in a Draw!';
  }

  if (game.state === 'stopped') {
    return 'Game Was Stopped!';
  }

  return 'Game Ended in Check Mate!';
};

export const ArchivedGame: React.FC<Props> = ({ game, myUserId }) => {
  const cls = useStyles();
  const windowWidth = useWindowWidth();

  // console.log('game', game)
  const result = getResult(game);
  const avatarSize = windowWidth < MOBILE_BREAKPOINT ? '32px' : '72px';

  return (
    <div
      className={cls.container}
      style={{
        borderLeft: `4px solid ${colors.primary}`,
        // borderRight: `4px solid ${colors}`,
      }}
    >
      <div className={cls.top}>
        <Text className={cls.title}>
          <strong>
            {capitalize(game.timeLimit)} ({formatTimeLimit(chessGameTimeLimitMsMap[game.timeLimit])}
            )
          </strong>{' '}
          played on <strong>{dateformat(game.createdAt, 'mmmm dd, yyyy HH:MM')}</strong>
        </Text>
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
                <Emoji
                  symbol={result === 'won' ? winningEmoji : result === 'lost' ? '' : drawEmoji}
                  className={cx(cls.emoji, cls.onlyDesktop)}
                />
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
                  {player.user.name}
                </Text>
                <Avatar mutunachiId={Number(player.user.avatarId)} size={avatarSize} />
              </div>
            </div>
          );
        })()}
        <div className={cls.middleSide}>
          <Emoji symbol="⚡" className={cls.vsEmoji} />
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
                    {player.user.name}
                  </Text>
                </div>
                <div className={cls.filler}>
                  <Emoji
                    symbol={result === 'won' ? winningEmoji : result === 'lost' ? '' : drawEmoji}
                    className={cx(cls.emoji, cls.onlyDesktop)}
                  />
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
        <div className={cls.pgnWrapper}>
          <ClipboardCopy value={game.pgn} />
        </div>
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: colors.white,
    padding: spacers.default,
    marginBottom: spacers.large,
    border: `1px solid ${colors.neutral}`,
    ...softBorderRadius,
    ...floatingShadow,
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
  title: {},
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
});
