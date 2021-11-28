import { ChessGameColor, ChessMove, gameRecord, Resources } from 'dstnd-io';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { noop, toDictIndexedBy } from 'src/lib/util';
import { usePeerStateClient } from 'src/providers/PeerProvider';
import { getCurrentlyStreamingRelayedGames } from '../BroadcastPage/resources';
import { createRelay } from './resource';
import { useGameActions } from 'src/modules/Games/GameActions';
import { ControlPanel } from './components/ControlPanel';
import { RelayInputGamesList } from './components/RelayInputGamesList';
import { RelayedGameRecord } from 'dstnd-io/dist/resourceCollections/relay/records';
import { Page } from 'src/components/Page';
import { spacers } from 'src/theme/spacers';
import { Button } from 'src/components/Button';
import { Text } from 'src/components/Text';
import { TimerAdjustmentDialog } from './components/TimerAdjustmentDialog';
import { gameRecordToGame, getPlayerByColor } from 'src/modules/Games/Chess/lib';
import { SocketClient } from 'src/services/socket/SocketClient';
import { AsyncOk } from 'ts-async-results';
import { FormModel, NewRelayDialog } from './components/NewRelayDialog';
import { Countdown } from 'src/modules/Games/Chess/components/Countdown';
import { getUserDisplayName } from 'src/modules/User';
import { timeLeftToInterval } from 'src/modules/Games/Chess/components/Countdown/util';
import { otherChessColor } from 'dstnd-io/dist/chessGame/util/util';
import { useInterval } from 'src/lib/hooks';
import { MoveTimesDialog } from './components/MoveTimesDialog';
import { CustomTheme, softBorderRadius } from 'src/theme';

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
  const [timersDialogVisible, setTimersDialogVisible] = useState(false);
  const [showNewRelayDialog, setShowNewRelayDialog] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [interval, setInterval] = useState<number>(0);
  const [finished, setFinished] = useState(false);
  const [turn, setTurn] = useState<ChessGameColor>('white');

  const submitMove = ({ minutes, seconds }: { minutes: string; seconds: string }) => {
    if (unsubmittedMove && selectedRelayId && minutes && seconds) {
      gameActions.onMoveRelayInput(
        unsubmittedMove,
        relayGames[selectedRelayId].game.id,
        selectedRelayId,
        Number(+minutes * 60 + +seconds) * 1000
      );
      setShowSubmitWindow(false);
      setTurn(otherChessColor(relayGames[selectedRelayId].game.lastMoveBy || 'white'));
    }
    return AsyncOk.EMPTY;
  };

  function fetchLiveGames() {
    getCurrentlyStreamingRelayedGames().map((relayGames) => {
      setRelayGames(toDictIndexedBy(relayGames, (relayGames) => relayGames.id));
    });
  }

  useEffect(() => {
    if (selectedRelayId) {
      setTimeLeft(relayGames[selectedRelayId].game.timeLeft[turn]);
    }
  }, [turn]);

  useInterval(
    () => {
      setTimeLeft((prev) => prev - interval);
    },
    finished || !selectedRelayId ? undefined : interval
  );

  useEffect(() => {
    setInterval(timeLeftToInterval(timeLeft));

    if (timeLeft <= 0) {
      setFinished(true);
    }
  }, [timeLeft]);

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

  const submitNewTimers = ({
    blackMinutes,
    blackSeconds,
    whiteMinutes,
    whiteSeconds,
  }: {
    blackMinutes: string;
    blackSeconds: string;
    whiteMinutes: string;
    whiteSeconds: string;
  }) => {
    const timers = {
      white: (Number(whiteMinutes) * 60 + Number(whiteSeconds)) * 1000,
      black: (Number(blackMinutes) * 60 + Number(blackSeconds)) * 1000,
    };
    if (selectedRelayId) {
      request({
        kind: 'relayAdjustGameTimersRequest',
        content: {
          gameId: relayGames[selectedRelayId].game.id,
          relayId: selectedRelayId,
          timers,
        },
      });
    }
    return AsyncOk.EMPTY;
  };

  const undoMove = () => {
    if (selectedRelayId) {
      request({
        kind: 'relayGameUndoMoveRequest',
        content: {
          gameId: relayGames[selectedRelayId].game.id,
          relayId: selectedRelayId,
        },
      });
      setUnsubmittedMove(undefined);
      setTurn(otherChessColor(turn));
    }
  };

  return (
    <Page stretched name="Relay Input" hideNav>
      <div className={cls.container}>
        <div className={cls.hero}>
          <div className={cls.main}>
            {selectedRelayId && (
              <div style={{ marginBottom: spacers.default, display: 'flex' }}>
                <Countdown
                  timeLeft={relayGames[selectedRelayId].game.timeLeft.black}
                  active
                  onFinished={noop}
                  gameTimeClass={relayGames[selectedRelayId].game.timeLimit}
                />
                <div style={{ width: spacers.largest }} />
                <Text size="subtitle1">
                  {getUserDisplayName(
                    getPlayerByColor('black', relayGames[selectedRelayId].game.players).user
                  )}
                </Text>
              </div>
            )}
            <ControlPanel
              relay={selectedRelayId ? relayGames[selectedRelayId] : undefined}
              containerWidth={500}
              onAddMove={(m) => setUnsubmittedMove(m)}
              onUndo={undoMove}
              onSubmit={() => {
                if (selectedRelayId && !relayGames[selectedRelayId].game.lastMoveBy) {
                  setTimeLeft(relayGames[selectedRelayId].game.timeLeft.white);
                }
                setShowSubmitWindow(true);
              }}
              submitDisabled={!unsubmittedMove}
            />
            {selectedRelayId && (
              <div style={{ marginTop: spacers.default, display: 'flex' }}>
                <Countdown
                  timeLeft={relayGames[selectedRelayId].game.timeLeft.white}
                  active
                  onFinished={noop}
                  gameTimeClass={relayGames[selectedRelayId].game.timeLimit}
                />
                <div style={{ width: spacers.largest }} />
                <Text size="subtitle1">
                  {getUserDisplayName(
                    getPlayerByColor('white', relayGames[selectedRelayId].game.players).user
                  )}
                </Text>
              </div>
            )}
          </div>
          <div className={cls.bottom}>
            <Button
              label="Adjust Timers"
              onClick={() => {
                if (selectedRelayId) {
                  setTimersDialogVisible(true);
                }
              }}
              disabled={!selectedRelayId}
              type="secondary"
            />
            <Button
              label="Create Another Relay"
              onClick={() => setShowNewRelayDialog(true)}
              type="positive"
            />
          </div>
        </div>
        <RelayInputGamesList
          games={Object.values(relayGames)}
          onSelectRelay={(relay) => setSelectedRelayId(relay.id)}
        />
      </div>
      {selectedRelayId && timersDialogVisible && (
        <TimerAdjustmentDialog
          visible={timersDialogVisible}
          game={gameRecordToGame(relayGames[selectedRelayId].game)}
          onClose={() => setTimersDialogVisible(false)}
          onSubmit={submitNewTimers}
        />
      )}
      {showNewRelayDialog && (
        <NewRelayDialog
          visible={showNewRelayDialog}
          onAddRelay={addRelay}
          onClose={() => setShowNewRelayDialog(false)}
        />
      )}
      {showSubmitWindow && (
        <MoveTimesDialog
          timeLeft={timeLeft}
          visible={showSubmitWindow}
          onClose={() => setShowSubmitWindow(false)}
          onSubmit={submitMove}
        />
      )}
    </Page>
  );
};

const useStyles = createUseStyles<CustomTheme>((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  main: {
    minWidth: '500px',
    marginRight: spacers.large,
  },
  dialog: {
    display: 'flex',
    flexDirection: 'column',
  },
  floatingBoxWidget: {
    height: '500px',
    marginTop: spacers.largest,
    display: 'flex',
    flex: 1,
    marginRight: spacers.largest,
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
  },
  bottom: {
    backgroundColor: theme.depthBackground.backgroundColor,
    width: '70%',
    ...softBorderRadius,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '16px',
    paddingLeft: spacers.default,
    borderLeft: `2px solid ${theme.colors.primary}`,
    marginTop: spacers.large,
  },
}));
