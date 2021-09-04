import React, { useState } from 'react';
import { createUseStyles, NestedCSSElement } from 'src/lib/jss';
import { GamesArchiveProvider } from 'src/modules/GamesArchive';
import { CompactArchivedGame } from 'src/modules/GamesArchive/components/ArchivedGame/CompactArchivedGame';
import { useAuthenticatedUser } from 'src/services/Authentication';
import { spacers } from 'src/theme/spacers';
import { colors, softBorderRadius } from 'src/theme';
import { GameRecord } from 'dstnd-io';
import { Text } from 'src/components/Text';
import { usePeerState } from 'src/providers/PeerProvider';

type Props = {
  onSelect: (g: GameRecord) => void;
};

export const MyGamesArchive: React.FC<Props> = (props) => {
  const cls = useStyles();
  // const user = useAuthenticatedUser();
  const peerState = usePeerState();

  if (peerState.status !== 'open') {
    return null;
  }

  return (
    <GamesArchiveProvider
      userId={peerState.me.id}
      pageSize={25}
      render={({ games }) => (
        <>
          {games.length > 0 ? (
            games.map((game) => (
              <div key={game.id} className={cls.row}>
                <CompactArchivedGame game={game} myUserId={peerState.me.id} />
                <div className={cls.hovered}>
                  <div className={cls.hoveredBkg} />
                  <div className={cls.hoveredContent} onClick={() => props.onSelect(game)}>
                    <Text size="subtitle1">Analyze</Text>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <Text size="small1">Wow So Empty</Text>
          )}
        </>
      )}
    />
  );
};

const useStyles = createUseStyles({
  row: {
    marginBottom: spacers.small,
    position: 'relative',
    ...softBorderRadius,
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
});
