/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useEffect, useState } from 'react';
import { toISODateTime } from 'src/lib/date/ISODateTime';
import { IceServerRecord } from 'dstnd-io';
import { SocketClient } from 'src/services/socket/SocketClient';
import { useSelector, useDispatch } from 'react-redux';
import { RoomCredentials } from './types';
import { PeerMessageEnvelope } from './records';
import { Proxy } from './lib/Proxy';
import { PeerContextProps, PeerContext } from './PeerContext';
import { selectPeerProviderState } from './redux/selectors';
import { resources } from 'src/resources';
import { selectAuthentication } from 'src/services/Authentication';
import useInstance from '@use-it/instance';
import { PeerConnectionsHandler, PeerConnectionsState, SocketConnectionHandler } from './Handlers';
import { addPeerStream, closePeerChannelsAction } from './redux/actions';

export type PeerProviderProps = {};

export const PeerProvider: React.FC<PeerProviderProps> = (props) => {
  const proxy = useInstance<Proxy>(() => new Proxy());
  const [contextState, setContextState] = useState<PeerContextProps>({ state: 'init' });
  const [socket, setSocket] = useState<SocketClient | undefined>();
  const [iceServers, setIceServers] = useState<IceServerRecord[]>();
  const auth = useSelector(selectAuthentication);
  const state = useSelector(selectPeerProviderState);
  const dispatch = useDispatch();

  const [pcState, setPCState] = useState<PeerConnectionsState>({ status: 'init' });

  // Get ICE Urls onmount
  useEffect(() => {
    (async () => {
      (await resources.getIceURLS()).map(setIceServers);
    })();
  }, []);

  // Context State Management
  useEffect(() => {
    setContextState(() => {
      if (!(state.me && socket)) {
        return {
          state: 'init',
        };
      }

      if (state.room && pcState.status === 'open') {
        return {
          state: 'joined',
          proxy,
          me: state.me,
          room: state.room,
          connected: pcState.status === 'open' && pcState.connected,

          connectToRoom: () => {
            if (state.room?.peers) {
              pcState.connect(state.room.peers);
            }
          },

          disconnectFromRoom: () => {
            if (pcState.status === 'open') {
              pcState.disconnect();
            }
          },

          leaveRoom: () => {
            pcState.destroy();

            socket.send({
              kind: 'leaveRoomRequest',
              content: undefined,
            });
          },

          // this is needed here as otherwise the old state is used
          broadcastMessage: (message) => {
            const payload: PeerMessageEnvelope = {
              message,
              timestamp: toISODateTime(new Date()),
            };

            if (pcState.status === 'open') {
              Object.values(pcState.client.connections).forEach((apc) => {
                apc.sendMessage(payload);
              });
            }

            proxy.publishOnPeerMessageSent(payload);
          },

          request: (payload) => socket?.send(payload),
        };
      }

      return {
        state: 'notJoined',
        proxy,
        me: state.me,
        joinRoom: (credentials: RoomCredentials) => {
          socket.send({
            kind: 'joinRoomRequest',
            content: {
              roomId: credentials.id,
              code: credentials.code,
            },
          });
        },
        request: (payload) => socket?.send(payload),
      };
    });
  }, [state.room, state.me, socket, pcState]);

  // TODO: Show a proper message if not authenticated for some reason
  if (auth.authenticationType === 'none') {
    return null;
  }

  return (
    <>
      <SocketConnectionHandler
        user={auth.user}
        dispatch={dispatch}
        peerProviderState={state}
        onReady={setSocket}
        render={() => {
          // The state.room is important to be present
          // before instantiating the handler b/c it should only
          // be created before being ready to connect to the peers
          if (iceServers && state.room) {
            return (
              <PeerConnectionsHandler
                onPeerStream={(p) => dispatch(addPeerStream(p))}
                onPeerDisconnected={(peerId) => {
                  dispatch(closePeerChannelsAction({ peerId }));
                }}
                iceServers={iceServers}
                user={auth.user}
                onStateUpdate={setPCState}
              />
            );
          }

          return null;
        }}
      />
      <PeerContext.Provider value={contextState}>{props.children}</PeerContext.Provider>
    </>
  );
};
