import { ChessGameColor, ChessMove, gameRecord, Resources } from 'dstnd-io';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { noop, toDictIndexedBy } from 'src/lib/util';
import { usePeerStateClient } from 'src/providers/PeerProvider';
import { getCurrentlyStreamingRelayedGames } from '../BroadcastPage/resources';
import { createRelay } from './resource';
import { useGameActions } from 'src/modules/Games/GameActions';
import { console, Object } from 'window-or-global';
import { ControlPanel, FormModel } from './components/ControlPanel';
import { RelayInputGamesList } from './components/RelayInputGamesList';
import { RelayedGameRecord } from 'dstnd-io/dist/resourceCollections/relay/records';
import { Page } from 'src/components/Page';
import { spacers } from 'src/theme/spacers';
import { Dialog } from 'src/components/Dialog';
import { TextInput } from 'src/components/TextInput';
import { Button } from 'src/components/Button';
import { Text } from 'src/components/Text';
import { getTimeInMinutesAndSeconds } from './utils';
import { TimerAdjustmentDialog } from './components/TimerAdjustmentDialog';
import { gameRecordToGame } from 'src/modules/Games/Chess/lib';
import { SocketClient } from 'src/services/socket/SocketClient';

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
  const [showSubmitWindow, setShowSubmitWindow] = useState(false);
  const [timerInputMinutes, setTimerInputMinutes] = useState<string>();
  const [timerInputSeconds, setTimerInputSeconds] = useState<string>();
  const [timersDialogVisible, setTimersDialogVisible] = useState(false);

  const submitMove = () => {
    if (unsubmittedMove && selectedRelayId && timerInputMinutes && timerInputSeconds) {
      gameActions.onMoveRelayInput(
        unsubmittedMove,
        relayGames[selectedRelayId].game.id,
        selectedRelayId,
        Number(+timerInputMinutes * 60 + +timerInputSeconds) * 1000
      );
      setShowSubmitWindow(false);
    }
  };

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
        timeLimit: m.specs,
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

  const request = useCallback<SocketClient['send']>(
    (payload) => {
      peerClient.send(payload);
    },
    [peerClient]
  );

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

  const submitNewTimers = ({ white, black }: { white: number; black: number }) => {
    if (selectedRelayId) {
      request({
        kind: 'relayAdjustGameTimersRequest',
        content: {
          gameId: relayGames[selectedRelayId].game.id,
          relayId: selectedRelayId,
          timers: { white, black },
        },
      });
    }
  };

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
            onSubmit={() => setShowSubmitWindow(true)}
            onAddRelay={addRelay}
            submitDisabled={!unsubmittedMove}
          />
          <Button
            label="Adjust Timers"
            onClick={() => {
              if (selectedRelayId) {
                setTimersDialogVisible(true);
              }
            }}
            type="secondary"
          />
          {selectedRelayId && timersDialogVisible &&  (
            <TimerAdjustmentDialog
              visible={timersDialogVisible}
              game={gameRecordToGame(relayGames[selectedRelayId].game)}
              onClose={() => setTimersDialogVisible(false)}
              onSubmit={submitNewTimers}
            />
          )}
          <Dialog
            visible={showSubmitWindow}
            onClose={() => setShowSubmitWindow(false)}
            content={
              <div className={cls.dialog}>
                <Text>Time Left</Text>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <TextInput
                    label="Minutes"
                    type="number"
                    onChange={(e) => {
                      setTimerInputMinutes(e.currentTarget.value);
                    }}
                  />
                  <TextInput
                    label="seconds"
                    type="number"
                    onChange={(e) => {
                      setTimerInputSeconds(e.currentTarget.value);
                    }}
                  />
                </div>
                <Button
                  type="positive"
                  label="Submit"
                  onClick={() => {
                    submitMove();
                  }}
                />
              </div>
            }
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
  dialog: {
    display: 'flex',
    flexDirection: 'column',
  },
});
