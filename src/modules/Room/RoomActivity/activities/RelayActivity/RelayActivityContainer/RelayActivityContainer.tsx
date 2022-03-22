import React, { useCallback, useEffect } from 'react';
import { ChessGameHistoryProvider } from 'src/modules/Games/Chess/components/GameHistory';
import { usePeerConnection } from 'src/providers/PeerConnectionProvider';
import { SocketClient } from 'src/services/socket/SocketClient';
import { DeviceSize } from 'src/theme/hooks/useDeviceSize';
import { RelayActivity } from '../RelayActivity/RelayActivity';
import { RoomRelayActivity } from '../types';

type Props = {
  activity: RoomRelayActivity;
  deviceSize: DeviceSize;
};

export const RelayActivityContainer: React.FC<Props> = ({ activity, deviceSize }) => {
  const pc = usePeerConnection();

  const request = useCallback<SocketClient['send']>(
    (payload) => {
      if (pc.ready) {
        pc.connection.send(payload);
      }
    },
    [pc.ready]
  );

  useEffect(() => {
    if (!activity.game && activity.relayId) {
      onSelectRelay(activity.relayId);
    }
  }, [activity.relayId]);

  // useEffect(() => {
  //   const unsubscribers: Function[] = [];

  //   if (peerState.status === 'open') {
  //     const usubscribe = peerState.client.onMessage((payload) => {

  //     });

  //     unsubscribers.push(usubscribe);
  //   }

  //   return () => {
  //     unsubscribers.forEach((unsubscribe) => unsubscribe());
  //   };
  // }, [peerState.status]);

  const onSelectRelay = (id: string) => {
    request({
      kind: 'importRelayedGameRequest',
      content: {
        relayId: id,
      },
    });
  };

  return (
    <>
      <ChessGameHistoryProvider
        key={activity.game?.id || new Date().getTime().toString()}
        history={activity.game?.history || []}
      >
        <RelayActivity
          activity={activity}
          deviceSize={deviceSize}
          onSelectedRelay={onSelectRelay}
        />
      </ChessGameHistoryProvider>
    </>
  );
};
