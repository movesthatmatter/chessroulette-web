import { Resources } from 'chessroulette-io';
import React, { useEffect, useState } from 'react';
import { Page } from 'src/components/Page';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { usePeerConnection } from 'src/providers/PeerConnectionProvider';
import { spacers } from 'src/theme/spacers';
import { WccCalendar } from './components/WccCalendar';
import { getCurrentlyStreamingRelayedGames } from './resources';

type Props = {};

export const BroadcastPage: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [relayGames, setRelayGames] = useState<Resources.AllRecords.Relay.RelayedGameRecord[]>(
    []
  );
  const pc = usePeerConnection();

  useEffect(() => {
    if (pc.ready) {
      const unsubscribers = [
        pc.connection.onMessage((payload) => {
          if (payload.kind === 'relayGameUpdateList') {
            fetchLiveGames();
          }
        }),
      ];

      return () => {
        unsubscribers.forEach((unsubscribe) => unsubscribe());
      };
    }
  }, [pc.ready]);

  useEffect(() => {
    fetchLiveGames();
  }, []);

  function fetchLiveGames() {
    getCurrentlyStreamingRelayedGames().map((relayGames) => {
      setRelayGames(relayGames);
    });
  }

  return (
    <Page name="Broadcasts" stretched containerClassname={cls.pageContainer}>
      <div className={cls.container}>
        <WccCalendar/>
      </div>
    </Page>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent:'center',
    margin: '0 auto'
  },
  verticalSpacer: {
    height: spacers.large
  },
  pageContainer: {
    ...makeImportant({
      ...(theme.name === 'lightDefault'
        ? {
            backgroundColor: theme.colors.background,
          }
        : {
            backgroundColor: '#27104e',
            backgroundImage: 'linear-gradient(19deg, #27104e 0%, #161a2b 25%)',
          }),
    }),
  },
}));
