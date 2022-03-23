import { GameRecord, UserRecord } from 'chessroulette-io';
import React from 'react';
import { Text } from 'src/components/Text';
import { createUseStyles, NestedCSSElement } from 'src/lib/jss';
import { floatingShadow, softBorderRadius, textShadowDarkMode } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { CompactGameListItem } from '../CompactGameListItem';

type Props = {
  games: GameRecord[];
  myUserId?: UserRecord['id'];
  hasClipboardCopy?: boolean;
} & (
  | {
      onSelect?: undefined;
    }
  | {
      onSelect: (g: GameRecord, itemIndex: number) => void;
      selectText: string;
    }
);

export const CompactGameList: React.FC<Props> = ({
  games,
  myUserId,
  hasClipboardCopy,
  ...props
}) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      {games.map((game, index) => (
        <div key={game.id} className={cls.row}>
          <CompactGameListItem
            game={game}
            myUserId={myUserId}
            hasClipboardCopyButton={hasClipboardCopy}
          />
          {props.onSelect && (
            <div className={cls.hovered}>
              <div className={cls.hoveredBkg} />
              <div className={cls.hoveredContent} onClick={() => props.onSelect(game, index)}>
                <Text size="subtitle1" className={cls.selectText}>
                  {props.selectText}
                </Text>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {},
  row: {
    marginBottom: spacers.small,
    position: 'relative',
    ...softBorderRadius,
    ...floatingShadow,
    overflow: 'hidden',

    ...({
      '&:hover > $hovered': {
        display: 'block !important',
      },
    } as NestedCSSElement),
  },
  hovered: {
    display: 'none',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  hoveredBkg: {
    cursor: 'pointer',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    background: theme.colors.neutralLightest,
    opacity: 0.7,
    zIndex: 98,
  },
  hoveredContent: {
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,

    color: theme.colors.black,
  },
  selectText: {
    ...(theme.name === 'darkDefault' ? textShadowDarkMode : {}),
  },
}));
