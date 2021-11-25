import { ChessGameColor, ChessMove, gameRecord, Resources } from 'dstnd-io';
import React, { useCallback, useEffect, useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { noop, toDictIndexedBy } from 'src/lib/util';
import { usePeerStateClient } from 'src/providers/PeerProvider';
import { getCurrentlyStreamingRelayedGames } from '../BroadcastPage/resources';
import { DesktopRoomLayout } from '../../Room/Layouts';
import { createRelay } from './resource';
import { useGameActions } from 'src/modules/Games/GameActions';
import { console, Object } from 'window-or-global';
import { SocketClient } from 'src/services/socket/SocketClient';
import { ControlPanel, FormModel } from './components/ControlPanel';
import { RelayInputGamesList } from './components/RelayInputGamesList';
import { RelayedGameRecord } from 'dstnd-io/dist/resourceCollections/relay/records';
import { Page } from 'src/components/Page';
import { spacers } from 'src/theme/spacers';

type Props = {};

type RelayedGames = {
  [k: string]: RelayedGameRecord;
};

export const RelayInputPage: React.FC<Props> = (props) => {
  const cls = useStyles();
  const peerClient = usePeerStateClient();
  const gameActions = useGameActions();
  const [relayGames, setRelayGames] = useState<RelayedGames>({});
  const [selectedRelayId, setSelectedRelayId] = useState<string>();
  const [unsubmittedMove, setUnsubmittedMove] = useState<ChessMove>();

  const request = useCallback<SocketClient['send']>(
    (payload) => {
      peerClient.send(payload);
    },
    [peerClient]
  );

  useEffect(() => {}, [request]);

  const submitMove = useCallback(() => {
    if (unsubmittedMove && selectedRelayId) {
      gameActions.onMoveRelayInput(
        unsubmittedMove,
        relayGames[selectedRelayId].game.id,
        selectedRelayId
      );
    }
    setUnsubmittedMove(undefined);
  }, [unsubmittedMove]);

  function fetchLiveGames() {
    getCurrentlyStreamingRelayedGames().map((relayGames) => {
      setRelayGames(toDictIndexedBy(relayGames, (relayGames) => relayGames.id));
    });
  }

  useEffect(() => {
    fetchLiveGames();
  }, []);

  const addRelay = (m: FormModel) => {
    return createRelay({
      relaySource: 'proxy',
      type: 'newGame',
      gameSpecs: {
        timeLimit: 'rapid30',
        preferredColor: 'white',
      },
      label: m.label,
      players: {
        white: {
          color: 'white',
          user: {
            id: m.whitePlayer,
            isGuest: true,
            firstName: m.whitePlayer,
            lastName: m.whitePlayer,
            name: m.whitePlayer,
            avatarId: '1',
          },
        },
        black: {
          color: 'black',
          user: {
            id: m.blackPlayer,
            isGuest: true,
            firstName: m.blackPlayer,
            lastName: m.blackPlayer,
            name: m.blackPlayer,
            avatarId: '2',
          },
        },
      },
    }).map((r) => {
      setRelayGames((prev) => ({
        ...prev,
        [r.id]: r,
      }));
      setSelectedRelayId(r.id);
    });
  };

  useEffect(() => {
    const unsubscribe = peerClient.onMessage((msg) => {
      if (msg.kind === 'relayGameUpdateList') {
        fetchLiveGames();
      }
      if (msg.kind === 'relayGameInputUpdateResponse') {
        setRelayGames((prev) => {
          return {
            ...prev,
            [msg.content.relayId]: { ...prev[msg.content.relayId], game: msg.content.game },
          };
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [peerClient]);

  // useEffect(() => {
  //   if (peerState.status === 'open') {
  //     const unsubscribers = [
  //       peerState.client.onMessage((payload) => {
  //         if (payload.kind === 'relayGameUpdateList') {
  //           fetchLiveGames();
  //         }
  //       }),
  //     ];

  //     return () => {
  //       unsubscribers.forEach((unsubscribe) => unsubscribe());
  //     };
  //   }
  // }, [peerState.status]);

  return (
    <Page stretched name="Relay Input" hideNav>
      <div className={cls.container}>
        <div className={cls.main}>
          <ControlPanel
            relay={selectedRelayId ? relayGames[selectedRelayId] : undefined}
            containerWidth={500}
            onAddMove={(m) => setUnsubmittedMove(m)}
            onSubmit={submitMove}
            onAddRelay={addRelay}
            submitDisabled={!unsubmittedMove}
          />
        </div>
        <RelayInputGamesList
          games={Object.values(relayGames)}
          onSelectRelay={(relay) => setSelectedRelayId(relay.id)}
        />
      </div>
    </Page>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  main: {
    width: '70%',
    marginRight: spacers.default,
  },
});
