import React, { useCallback, useEffect, useMemo } from 'react';
import { Game } from 'src/modules/Games';
import { ChessGameHistoryProvider } from 'src/modules/Games/Chess/components/GameHistory';
import { gameRecordToGame } from 'src/modules/Games/Chess/lib';
import { GameProvider } from 'src/modules/Games/Providers/GameProvider/GameProvider';
import { usePeerState } from 'src/providers/PeerProvider';
import { SocketClient } from 'src/services/socket/SocketClient';
import { DeviceSize } from 'src/theme/hooks/useDeviceSize';
import { console, Date } from 'window-or-global';
import { RelayActivity } from '../RelayActivity/RelayActivity';
import { RoomRelayActivity } from '../types';

type Props = {
  activity: RoomRelayActivity;
  deviceSize: DeviceSize;
};

export const RelayActivityContainer: React.FC<Props> = ({ activity, deviceSize }) => {
  const peerState = usePeerState();

  const request = useCallback<SocketClient['send']>(
    (payload) => {
      if (peerState.status === 'open') {
        peerState.client.send(payload);
      }
    },
    [peerState.status]
  );

  useEffect(() => {
    if (!activity.game) {
      request({
        kind: 'importRelayedGameRequest',
        content: {
          gameId: activity.gameId
        }
      })
    }
  },[activity.gameId])

  useEffect(() => {
    const unsubscribers: Function[] = [];

    if (peerState.status === 'open') {
      const usubscribe = peerState.client.onMessage((payload) => {
        if (payload.kind === 'joinedGameUpdated') {
          console.log('GAME UPDATED');
          //onGameUpdated(gameRecordToGame(payload.content));
        } else if (payload.kind === 'joinedRoomAndGameUpdated') {
          console.log('GAME AND ROOM UPDATED')
          //onGameUpdated(gameRecordToGame(payload.content.game));
        }
      });

      unsubscribers.push(usubscribe);
    }

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [peerState.status]);

  return (
    <>
      <ChessGameHistoryProvider
        key={activity.game?.id || new Date().getTime().toString()}
        history={activity.game?.history || []}
      >
          <RelayActivity activity={activity} deviceSize={deviceSize} />
      </ChessGameHistoryProvider>
      </>
  );
};
