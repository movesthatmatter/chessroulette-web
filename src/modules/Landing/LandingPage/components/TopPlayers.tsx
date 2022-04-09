import { PlayerGamesCountStat } from 'chessroulette-io/dist/resourceCollections/game/records';
import React from 'react';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { getUserDisplayName } from 'src/modules/User';
import { PeerAvatar } from 'src/providers/PeerConnectionProvider';
import { CustomTheme } from 'src/theme';
import { spacers } from 'src/theme/spacers';

type Props = {
  players: PlayerGamesCountStat[];
};

export const TopPlayers: React.FC<Props> = ({ players }) => {
  const cls = useStyles();

  return (
    <>
      {players.map((r) => (
        <div
          key={r.user.id}
          style={{
            display: 'flex',
            flexDirection: 'row',
            flex: 1,
            width: '100%',
            marginBottom: spacers.large,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flex: 1,
              alignItems: 'center',
            }}
          >
            <PeerAvatar peerUserInfo={r.user} />
            <div style={{ width: spacers.small }} />
            <Text size="small1">{getUserDisplayName(r.user)}</Text>
          </div>
          <Text size="small1" className={cls.topPlayerStats}>
            {r.gamesCount} Games
          </Text>
        </div>
      ))}
    </>
  );
};

const useStyles = createUseStyles<CustomTheme>((theme) => ({
  topPlayerStats: {
    color: theme.text.subtle,
  },
}));
