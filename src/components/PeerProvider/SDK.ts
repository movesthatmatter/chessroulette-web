export const s = 2;

// import { Peer, Room } from '../RoomProvider';
// import { wNamespace, woNamespace } from './util';
// import PeerSDK from 'peerjs';
// import config from 'src/config';
// import { IceServerRecord } from 'dstnd-io';
// import { logsy } from 'src/lib/logsy';
// import { PeerConnectionMetadata } from './records';
// import { ActivePeerConnections } from './ActivePeerConnections';

// export const initialize = ({
//   iceServers,
//   me,
//   room,
// }: {
//   iceServers: IceServerRecord[],
//   me: Peer,
//   room: Room,
// }) => {
//   const sdk = new PeerSDK(wNamespace(me.id), {
//     ...config.SIGNALING_SERVER_CONFIG,
//     config: {
//       iceServers,
//     },
//   });

//   const activePeerConnections = new ActivePeerConnections();

//   const onErrorHandler = logsy.error;
//   const onOpenHandler = () => {
//     // Connect to all Peers
//     Object.values(room.peers)
//       .filter(({ id }) => id !== me.id)
//       .forEach((peer) => {
//         const namespacedPeerId = wNamespace(peer.id);

//         const metadata: PeerConnectionMetadata = {
//           peer: me,
//         };

//         const pc = sdk.connect(namespacedPeerId, { metadata });

//         pc.on('error', logsy.error);

//         pc.on('open', () => {
//           activePeerConnections.add(peer.id, { data: pc });

//           dispatch(addPeerAction(currentJoinedRoom.peers[peer.id]));

//           navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
//             const call = sdk.call(namespacedPeerId, stream);

//             call.on('stream', (remoteStream) => {
//               dispatch(
//                 addPeerStream({
//                   peerId: peer.id,
//                   stream: remoteStream,
//                 })
//               );
//             });

//             activePeerConnections.add(peer.id, {
//               media: {
//                 connection: call,
//                 localStream: stream,
//               },
//             });
//           });
//         });

//         pc.on('data', onDataHandler);

//         pc.on('close', () => {
//           dispatch(removePeerAction({ peerId: peer.id }));

//           activePeerConnections.remove(peer.id);
//         });
//       });
//   };
//   const onConnectionHandler = (pc: Peer.DataConnection) => {
//     const peerId = woNamespace(pc.peer);

//     // TODO: Remove these event listeners as well!
//     pc.on('error', logsy.error);

//     pc.on('data', onDataHandler);

//     pc.on('open', () => {
//       eitherToResult(peerConnectionMetadata.decode(pc.metadata)).map((metadata) => {
//         activePeerConnections.add(peerId, { data: pc });

//         dispatch(addPeerAction(metadata.peer));
//       });
//     });

//     pc.on('close', () => {
//       activePeerConnections.remove(peerId);

//       dispatch(removePeerAction({ peerId }));
//     });
//   };

//   const onCallHandler = (call: PeerSDK.MediaConnection) => {
//     const peerId = woNamespace(call.peer);

//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((localStream) => {
//         activePeerConnections.add(peerId, {
//           media: {
//             connection: call,
//             localStream,
//           },
//         });

//         return localStream;
//       })
//       .then((localStream) => {
//         call.answer(localStream);
//         call.on('stream', (remoteStream) => {
//           dispatch(
//             addPeerStream({
//               peerId,
//               stream: remoteStream,
//             })
//           );
//         });
//       });
//   };

//   const onCloseHandler = () => {
//     console.log('SDK on close');
//   };
//   const onDisconnectedHandler = () => {
//     console.log('SDK on disconnected');
//   };

//   sdk.on('error', onErrorHandler);
//   sdk.on('open', onOpenHandler);
//   sdk.on('connection', onConnectionHandler);
//   sdk.on('call', onCallHandler);
//   sdk.on('close', onCloseHandler);
//   sdk.on('disconnected', onDisconnectedHandler);

//   return () => {
//     // Unsubscribers
//     sdk.off('error', onErrorHandler);
//     sdk.on('open', onOpenHandler);
//     sdk.off('connection', onConnectionHandler);
//     sdk.off('call', onCallHandler);
//     sdk.off('close', onCloseHandler);
//     sdk.off('disconnected', onDisconnectedHandler);
//   };
// };
