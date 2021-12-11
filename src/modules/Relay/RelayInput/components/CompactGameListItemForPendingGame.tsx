import React, { useMemo } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { hideOnMobile, onlyDesktop, softBorderRadius, textShadowDarkMode } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import cx from 'classnames';
import { Avatar } from 'src/components/Avatar';
import { Text } from 'src/components/Text';
import { GameRecord } from 'dstnd-io';
import dateformat from 'dateformat';
import { getUserDisplayName } from 'src/modules/User';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import capitalize from 'capitalize';
import { ChessColorAvatar } from 'src/components/ChessColorAvatar/ChessColorAvatar';

type Props = {
  game: GameRecord;
  containerClassName?: string;
};

const pieceSize = 28;

export const CompactGameListItemForPendingGame: React.FC<Props> = ({
  game,
  containerClassName,
}) => {
  const cls = useStyles();
  const { theme } = useColorTheme();

  const renderTitle = useMemo(() => {
    return (
      <Text className={cls.title} size="small2">
        {dateformat(game.createdAt, 'dd-mm-yyyy')}
        {' | '}
        {capitalize(game.timeLimit)}
      </Text>
    );
  }, [game.createdAt, game.timeLimit]);

  const renderLeftPlayer = useMemo(() => {
    const player = game.players[0];
    return (
      <div className={cls.playerInfo}>
        <Text className={cls.playerName} size="small2">
          {getUserDisplayName(player.user)}
        </Text>
        <ChessColorAvatar pieceColor={player.color} color="positiveLight" size={pieceSize} />
      </div>
    );
  }, [game, cls]);

  const renderRightPlayer = useMemo(() => {
    const player = game.players[1];
    return (
      <>
        <div className={cls.playerInfo}>
          <Text className={cls.playerName} size="small2">
            {getUserDisplayName(player.user)}
          </Text>
          <ChessColorAvatar pieceColor={player.color} color="positiveLight" size={pieceSize} />
        </div>
      </>
    );
  }, [game, cls]);

  return (
    <>
      <div className={cx(cls.container, containerClassName)}>
        <div className={cls.top}>{renderTitle}</div>
        <div className={cls.gameContainer}>
          {renderLeftPlayer}
          <div className={cls.middleSide}>
            <FontAwesomeIcon
              icon={faBolt}
              color={theme.name === 'lightDefault' ? 'black' : 'white'}
              size="sm"
            />
          </div>
          {renderRightPlayer}
        </div>
      </div>
    </>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '5px',
    width: '150px',
    ...softBorderRadius,
    ...theme.floatingShadow,
  },
  gameContainer: {
    display: 'flex',
    flexDirection: 'column',
  },

  middleSide: {
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
  playerInfo: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  playerName: {
    paddingLeft: spacers.smaller,
    paddingRight: spacers.smaller,
    overflowWrap: 'anywhere',
    wordBreak: 'break-all',
    color: theme.text.primaryColor,
  },
  onlyDesktop: {
    ...hideOnMobile,
  },
}));
