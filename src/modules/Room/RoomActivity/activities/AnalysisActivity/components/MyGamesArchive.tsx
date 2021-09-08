import React from 'react';
import { createUseStyles, CSSProperties, NestedCSSElement } from 'src/lib/jss';
import { GamesArchiveProvider } from 'src/modules/GamesArchive';
import { CompactArchivedGame } from 'src/modules/GamesArchive/components/ArchivedGame/CompactArchivedGame';
import { spacers } from 'src/theme/spacers';
import { colors, floatingShadow, softBorderRadius } from 'src/theme';
import { GameRecord } from 'dstnd-io';
import { Text } from 'src/components/Text';
import { usePeerState } from 'src/providers/PeerProvider';
import { renderMatch } from 'src/lib/renderMatch';
import Loader from 'react-loaders';
import { FloatingBox } from 'src/components/FloatingBox';

type Props = {
  onSelect: (g: GameRecord) => void;
};

export const MyGamesArchive: React.FC<Props> = (props) => {
  const cls = useStyles();
  const peerState = usePeerState();

  if (peerState.status !== 'open') {
    return null;
  }

  return (
    <GamesArchiveProvider
      userId={peerState.me.id}
      pageSize={25}
      render={({ isLoading, games, isEmpty }) =>
        renderMatch(
          () =>
            games.map((game) => (
              <div key={game.id} className={cls.row}>
                <CompactArchivedGame
                  game={game}
                  myUserId={peerState.me.id}
                  hasClipboardCopyButton={false}
                />
                <div className={cls.hovered}>
                  <div className={cls.hoveredBkg} />
                  <div className={cls.hoveredContent} onClick={() => props.onSelect(game)}>
                    <Text size="subtitle1">Analyze</Text>
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
  );
};

const useStyles = createUseStyles({
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
    background: colors.neutralDarkest,
    opacity: 0.5,
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

    color: colors.white,
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // minHeight: '100px',

    transform: 'scale(.7)',
    ...({
      '& > div': {
        backgroundColor: colors.primary,
      },
    } as CSSProperties),
  },
});
