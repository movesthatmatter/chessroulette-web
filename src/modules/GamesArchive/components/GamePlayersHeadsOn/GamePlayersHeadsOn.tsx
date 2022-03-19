import React from 'react';
import cx from 'classnames';
import { Avatar } from 'src/components/Avatar';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import { ChessGameColor, GameRecord } from 'dstnd-io';
import { otherChessColor } from 'dstnd-io/dist/chessGame/util/util';
import { getUserDisplayName } from 'src/modules/User';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';

type Props = {
  players: GameRecord['players'];
  winner?: GameRecord['winner'];
  avatarSize?: number;
};

const getResult = (playerColor: ChessGameColor, winner?: GameRecord['winner']) =>
  (({
    [playerColor]: 'won',
    [otherChessColor(playerColor)]: 'lost',
    '1/2': '1/2',
    'no-result': undefined,
  } as const)[winner || 'no-result']);

export const GamePlayersHeadsOn: React.FC<Props> = React.memo(
  ({ players, winner, avatarSize = 28 }) => {
    const cls = useStyles();
    const { theme } = useColorTheme();
    const colors = theme.colors;

    return (
      <div className={cls.container}>
        <div className={cls.sideWrapper}>
          {(() => {
            const player = players[0];
            const result = getResult(player.color, winner);

            return (
              <div className={cx(cls.side, cls.leftSide)}>
                <div className={cls.filler} />
                <div className={cx(cls.playerInfo, cls.playerInfoLeftSide)}>
                  <Text
                    className={cls.playerName}
                    size="small2"
                    style={
                      result === 'won'
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
          })()}
          <div className={cls.middleSide}>
            <FontAwesomeIcon icon={faBolt} color="white" size="sm" />
          </div>
          <div className={cx(cls.side, cls.rightSide)}>
            {(() => {
              const player = players[1];
              const result = getResult(player.color, winner);

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
        </div>
      </div>
    );
  }
);

const useStyles = createUseStyles((theme) => ({
  container: {},
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
    // overflowWrap: 'anywhere',
    // wordBreak: 'break-all',
    color: theme.text.primaryColor,
  },
}));
