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
import { ControlPanel } from './components/ControlPanel';
import { RelayInputGamesList } from './components/RelayInputGamesList';
import { RelayedGameRecord } from 'dstnd-io/dist/resourceCollections/relay/records';

type Props = {};

const LAYOUT_RATIOS = {
  leftSide: 1.2,
  mainArea: 1,
  rightSide: 2.1,
};

type RelayedGames = {
  [k: string] : RelayedGameRecord
}

export const RelayInputPage: React.FC<Props> = (props) => {
  const cls = useStyles();
  const peerClient = usePeerStateClient();
  const gameActions = useGameActions();
  const [relayGames, setRelayGames] = useState<RelayedGames>({});
  const [selectedRelayId, setSelectedRelayId] = useState<string>();
  const [unsubmittedMove, setUnsubmittedMove] = useState<ChessMove>();

  const request = useCallback<SocketClient['send']>(
    (payload) => {
      peerClient.send(payload)
    },
    [peerClient]
  );

  useEffect(() => {
    
  },[request])
 
  const submitMove = useCallback(() => {
   if (unsubmittedMove && selectedRelayId) {
    gameActions.onMoveRelayInput(unsubmittedMove, relayGames[selectedRelayId].game.id,  selectedRelayId);
  }
    setUnsubmittedMove(undefined);
  }, [unsubmittedMove]);

  function fetchLiveGames() {
    getCurrentlyStreamingRelayedGames().map((relayGames) => {
      setRelayGames(toDictIndexedBy(relayGames, relayGames => relayGames.id));
    })
  }

  useEffect(() => {
    fetchLiveGames();
  }, []);

  const addRelay = () => {
    console.log('add relay')
    createRelay({
      relaySource: 'proxy',
      type: 'newGame',
      gameSpecs: {
        timeLimit: 'rapid30',
        preferredColor: 'white',
      },
      players: {
        white: {
          color: 'white',
          user: {
            id: 'Magnus',
            isGuest: true,
            firstName: 'Magnus',
            lastName: 'Carlsen',
            name: 'Magnus Carlsen',
            avatarId: '1',
          },
        },
        black: {
          color: 'black',
          user: {
            id: 'Nepo',
            isGuest: true,
            firstName: 'Nepo',
            lastName: 'Itch',
            name: 'Nepo itch',
            avatarId: '2',
          },
        },
      },
    }).map((r) => {
      setRelayGames(prev => ({
        ...prev,
        [r.id]: r
      }))
      setSelectedRelayId(r.id);
    });
  }
  

  useEffect(() => {
    const unsubscribe = peerClient.onMessage((msg) => {
      if (msg.kind === 'relayGameUpdateList') {
        fetchLiveGames();
      }
      if (msg.kind === 'relayGameInputUpdateResponse') {
        setRelayGames(prev => {
          return {
            ...prev,
            [msg.content.relayId] : {...prev[msg.content.relayId], game: msg.content.game}
          }
        })
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
    <DesktopRoomLayout
      className={cls.container}
      ratios={LAYOUT_RATIOS}
      topHeight={80}
      bottomHeight={80}
      renderActivityComponent={(d) => (
        <ControlPanel 
          relay={selectedRelayId ? relayGames[selectedRelayId] : undefined} 
          containerWidth={d.main.width} 
          onAddMove={(m) => setUnsubmittedMove(m)}
          onSubmit ={submitMove}
          onAddRelay={addRelay}
          submitDisabled={!unsubmittedMove}
        />
      )}
      renderBottomComponent={() => null}
      renderRightSideComponent={() => (
        <RelayInputGamesList games={Object.values(relayGames)} onSelectRelay={(relay) => setSelectedRelayId(relay.id)}/>
      )}
      renderTopComponent={() => null}
    />
  );
};

const useStyles = createUseStyles({
  container: {},
});
