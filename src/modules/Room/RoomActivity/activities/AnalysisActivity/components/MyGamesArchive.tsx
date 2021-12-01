import React from 'react';
import { createUseStyles, CSSProperties, NestedCSSElement } from 'src/lib/jss';
import { GamesArchiveProvider } from 'src/modules/GamesArchive';
import { spacers } from 'src/theme/spacers';
import { floatingShadow, softBorderRadius } from 'src/theme';
import { GameRecord } from 'dstnd-io';
import { Text } from 'src/components/Text';
import { renderMatch } from 'src/lib/renderMatch';
import Loader from 'react-loaders';
import { FloatingBox } from 'src/components/FloatingBox';
import { useAuthentication } from 'src/services/Authentication';
import { AuthenticationButton } from 'src/services/Authentication/widgets';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { CompactGameList } from 'src/modules/Games/Chess/components/GamesList/components/CompactGameList';

type Props = {
  onSelect: (g: GameRecord) => void;
  hasClipboardCopy?: boolean;
};

export const MyGamesArchive: React.FC<Props> = (props) => {
  const cls = useStyles();
  const auth = useAuthentication();
  const { theme } = useColorTheme();

  if (auth.authenticationType !== 'user') {
    return (
      <FloatingBox>
        <Text size="small1">Authenticate below to see your games.</Text>
        <br />
        <br />
        <AuthenticationButton label="Authenticate" full />
      </FloatingBox>
    );
  }

  return (
    <GamesArchiveProvider
      userId={auth.user.id}
      pageSize={25}
      render={({ isLoading, games, isEmpty }) =>
        renderMatch(
          () => (
            <CompactGameList
              games={games}
              myUserId={auth.user.id}
              onSelect={props.onSelect}
              selectText="Analyze"
              hasClipboardCopy={props.hasClipboardCopy}
            />
          ),
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
  );
};

const useStyles = createUseStyles((theme) => ({
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
