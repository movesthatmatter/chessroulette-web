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
import { selectMediaStatus } from 'src/modules/Rooms/GenericRoom/GenericRoomBouncer/selectors';

export type PeerProviderProps = {};

export const PeerProvider: React.FC<PeerProviderProps> = (props) => {
  const proxy = useInstance<Proxy>(() => new Proxy());
  const [contextState, setContextState] = useState<PeerContextProps>({ state: 'init' });
  const [pcState, setPCState] = useState<PeerConnectionsState>({ status: 'init' });
  const [socket, setSocket] = useState<SocketClient | undefined>();
  const [iceServers, setIceServers] = useState<IceServerRecord[]>();
  const auth = useSelector(selectAuthentication);
  const state = useSelector(selectPeerProviderState);

  const avStreamingConstraints = useSelector(selectMediaStatus);

  const dispatch = useDispatch();

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

      // Note: This means that if the RTC Server is down
      //  it won't connect to a room.
      //  This is actualy super fucked up as it doesnt update properly like this!
      // TODO: I need to rethin this whole context state shit!
      if (state.room && pcState.status === 'open') {
        return {
          state: 'joined',
          proxy,
          me: state.me,
          room: state.room,
          connected: pcState.status === 'open' && pcState.connected,

          connectToRoom: () => {
            console.log('connect to room', pcState);
            if (state.room?.peers && pcState.status === 'open') {
              pcState.connect(state.room.peers);
            }
          },

          disconnectFromRoom: () => {
            pcState.disconnect();
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

          // @deprecate in favor of send Message
          request: (payload) => socket?.send(payload),

          sendMessage: socket.send.bind(socket),
          onMessage: socket.onMessage.bind(socket),
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

        // @deprecate in favor of send Message
        sendMessage: socket.send.bind(socket),
        onMessage: socket.onMessage.bind(socket),
      };
    });
  }, [state.room, state.me, socket, pcState]);

  return (
    <>
      {/* // TODO: Show a proper message if not authenticated for some reason */}
      {auth.authenticationType !== 'none' && (
        <SocketConnectionHandler
          {...auth.authenticationType === 'guest' ? {
            isGuest: true,
            guestUser: auth.user,
          } : {
            isGuest: false,
            accessToken: auth.accessToken,
          }}
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
                  avStreamingConstraints={avStreamingConstraints}
                  // TODO: Jul 21 - Do We need an on peer updated??

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
      )}
      <PeerContext.Provider value={contextState}>{props.children}</PeerContext.Provider>
    </>
  );
};
