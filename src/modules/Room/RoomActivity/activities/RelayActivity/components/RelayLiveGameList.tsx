import React from 'react';
import Loader from 'react-loaders';
import { FloatingBox } from 'src/components/FloatingBox';
import { Text } from 'src/components/Text';
import { createUseStyles, CSSProperties, NestedCSSElement } from 'src/lib/jss';
import { renderMatch } from 'src/lib/renderMatch';
import { ChessGameDisplay } from 'src/modules/Games/widgets/ChessGameDisplay';
import { CustomTheme, floatingShadow, softBorderRadius, textShadowDarkMode } from 'src/theme';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { spacers } from 'src/theme/spacers';
import { RelayedGameProvider } from './RelayedGameProvider';

type Props = {
  onSelect: (id: string) => void;
};

export const RelayLiveGameList: React.FC<Props> = ({ onSelect }) => {
  const cls = useStyles();
  const { theme } = useColorTheme();

  return (
    <div className={cls.container}>
      <div className={cls.scroller}>
        <div className={cls.box} style={{ width: '100%' }}>
          <RelayedGameProvider
            pageSize={20}
            render={({ isLoading, games, isEmpty }) =>
              renderMatch(
                () =>
                  games.map((item) => (
                    <div key={item.game.id} className={cls.row}>
                      <ChessGameDisplay game={item.game} className={cls.board} thumbnail/>
                      <div className={cls.hovered}>
                        <div className={cls.hoveredBkg} />
                        <div className={cls.hoveredContent} onClick={() => onSelect(item.relayId)}>
                          <Text
                            size='largeBold'
                            style={theme.name === 'darkDefault' ? { ...textShadowDarkMode, color: theme.colors.primary } : {}}
                          >
                            Select
                          </Text>
                        </div>
                      </div>
                    </div>
                  )),
                [
                  isLoading,
                  () => (
                    <FloatingBox>
                      <Loader type="ball-pulse" active innerClassName={cls.loader} />
                    </FloatingBox>
                  ),
                ],
                [
                  isEmpty,
                  () => (
                    <FloatingBox>
                      <Text size="small1">Wow So Empty</Text>
                    </FloatingBox>
                  ),
                ]
              )
            }
          />
          </div>
        </div>
    </div>
  );
};

const FLOATING_SHADOW_HORIZONTAL_OFFSET = spacers.large;
const FLOATING_SHADOW_BOTTOM_OFFSET = `48px`;

const useStyles = createUseStyles<CustomTheme>((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    height: '100%',
    padding: spacers.default,
  },
  scroller: {
    display: 'flex',
    overflowY: 'scroll',
    scrollBehavior: 'smooth',
    width: '100%',
    height: '100%',
  },
  box: {
    paddingLeft: FLOATING_SHADOW_HORIZONTAL_OFFSET,
    paddingRight: FLOATING_SHADOW_HORIZONTAL_OFFSET,
    paddingBottom: FLOATING_SHADOW_BOTTOM_OFFSET,
    marginBottom: `-${FLOATING_SHADOW_BOTTOM_OFFSET}`,

    paddingTop: spacers.default,

    '&:first-child': {
      paddingTop: 0,
    },

    '&:last-child': {
      marginBottom: 0,
    },
  },
  row: {
    marginBottom: spacers.default,
    position: 'relative',
    ...softBorderRadius,
   // ...floatingShadow,
    overflow: 'hidden',

    ...({
      '&:hover > $hovered': {
        display: 'block !important',
      },
    } as NestedCSSElement),
  },
  board: {
    ...softBorderRadius,
    overflow: 'hidden',
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
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // minHeight: '100px',

    transform: 'scale(.7)',
    ...({
      '& > div': {
        backgroundColor: theme.colors.primary,
      },
    } as CSSProperties),
  },
}));
