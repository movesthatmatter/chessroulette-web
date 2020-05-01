import React from 'react';
import { GameRoom } from './GameRoom';
import { GameRoomContainer } from './GameRoomContainer';

export default {
  component: GameRoom,
  title: 'Modules/GameRoomContainer',
};

export const defaultStory = () => (
  <GameRoomContainer />
);

// const localStreamClient = new LocalStreamClient();

// export const mockedPeers = () => React.createElement(() => {
//   const [remoteStreams, setRemoteStreams] = useState<PeerStream[]>([]);

//   const FakePeers = {
//     Kasparov: 'Kasparov',
//     Spectator1: 'Spectator1',
//   };

//   useEffect(() => {
//     setTimeout(async () => {
//       const stream = await localStreamClient.start();

//       setRemoteStreams((prevRemoteStreams) => [
//         ...prevRemoteStreams,
//         {
//           peerId: FakePeers.Kasparov,
//           stream,
//         },
//       ]);
//     });

//     setTimeout(async () => {
//       const stream = await localStreamClient.start();

//       setRemoteStreams((prevRemoteStreams) => [
//         ...prevRemoteStreams,
//         {
//           peerId: FakePeers.Spectator1,
//           stream,
//         },
//       ]);
//     }, 100);
//   }, []);

//   return (
//     <GameRoom
//       currentGame={{
//         players: {
//           white: {
//             name: 'Gabe',
//             color: 'white',
//           },
//           black: {
//             name: FakePeers.Kasparov,
//             color: 'black',
//           },
//         },
//         fen: undefined,
//       }}
//       remoteStreams={remoteStreams}
//       me="Gabe"
//       peers={Object.keys(FakePeers)}
//     />
//   );
// });


// export const realDeal = () => React.createElement(() => {
//   const [chatHistory, setChatHistory] = useState<PeerMessage[]>([]);
//   const [currentGame, setCurrentGame] = useState<ChessGameState | undefined>();
//   const p2pProviderRef = useRef<Peer2PeerProvider>(null);

//   const getNewChessGame = (betweenPeersById: string[]): ChessGameState => {
//     const shuffledPeers = shuffle(betweenPeersById);

//     return {
//       players: {
//         white: {
//           name: shuffledPeers[0],
//           color: 'white',
//         },
//         black: {
//           name: shuffledPeers[1],
//           color: 'black',
//         },
//       },
//       fen: undefined,
//     } as const;
//   };

//   const updateGameStateFen = (fen?: ChessGameFen) => {
//     setCurrentGame((prev) => prev && ({
//       ...prev,
//       fen,
//     }));
//   };

//   return (
//     <>
//       <Peer2PeerProvider
//         ref={p2pProviderRef}
//         // wssUrl="ws://127.0.0.1:7777"
//         wssUrl="wss://dstnd-server.herokuapp.com"
//         iceServersURLs={['stun:stun.ideasip.com']}
//         renderLoading={() => (
//           <p>Loading Connection...</p>
//         )}
//         onPeerMsgSent={(payload) => {
//           decodePeerData(payload.content).map(
//             (msg) => {
//               if (msg.msgType === 'chatMessage') {
//                 setChatHistory((prev) => [
//                   ...prev,
//                   {
//                     // This is a hack to unwrap the content only
//                     ...payload,
//                     content: msg.content,
//                   },
//                 ]);
//               } else if (msg.msgType === 'gameStarted') {
//                 setCurrentGame(msg.content);
//               } else if (msg.msgType === 'gameUpdate') {
//                 // Not sure this is good here as the result should be instant
//                 updateGameStateFen(msg.content.fen);
//               }
//             },
//           );
//         }}
//         onPeerMsgReceived={(payload, { sendPeerData, peerStatus }) => {
//           decodePeerData(payload.content).map((msg) => {
//             if (msg.msgType === 'chatMessage') {
//               setChatHistory((prev) => [
//                 ...prev,
//                 {
//                   // This is a hack to unwrap the content only
//                   ...payload,
//                   content: msg.content,
//                 },
//               ]);
//             } else if (msg.msgType === 'gameInvitation') {
//               // console.log('game invitation', msg, msg.content.to !== peerStatus.me);
//               // If the invitation is not to me return early
//               if (msg.content.to !== peerStatus.me) {
//                 return;
//               }

//               const newGame = getNewChessGame([msg.content.from, msg.content.to]);

//               const whitePlayer = newGame.players.white;
//               const blackPlayer = newGame.players.black;

//               // Oterwise Accept it right awaiy for now
//               const returnMsgPayload: GameStartedRecord = {
//                 msgType: 'gameStarted',
//                 gameType: 'chess',
//                 content: {
//                   players: {
//                     white: whitePlayer,
//                     black: blackPlayer,
//                   },
//                   fen: newGame.fen,
//                 },
//               };

//               // Send the game to the peers
//               sendPeerData(returnMsgPayload);
//             } else if (msg.msgType === 'gameStarted') {
//               setCurrentGame(msg.content);
//             } else if (msg.msgType === 'gameUpdate') {
//               updateGameStateFen(msg.content.fen);
//             }
//           });
//         }}
//         render={({
//           remoteStreams,
//           peerStatus,
//           sendPeerData,
//           joinRoom,
//           start,
//           localStream,
//         }) => (
//           <>
//             {peerStatus.joined_room && localStream ? (
//               <GameRoom
//               // players={currentGame?.players}
//                 currentGame={currentGame}
//                 remoteStreams={Object.values(remoteStreams || {})}
//                 me={peerStatus.me}
//                 chatHistory={chatHistory}
//                 onNewChatMessage={(content) => {
//                   const chatMsgPayload: ChatMessageRecord = {
//                     msgType: 'chatMessage',
//                     content,
//                   };

//                   sendPeerData(chatMsgPayload);
//                 }}
//                 peers={Object.keys(peerStatus.joined_room.peers)}
//                 onNewGame={async (peers) => {
//                   sendPeerData({
//                     msgType: 'gameInvitation',
//                     gameType: 'chess',
//                     content: {
//                       from: peers[0],
//                       to: peers[1],
//                     },
//                   });
//                 }}
//                 onGameStateUpdate={(fen) => {
//                   sendPeerData({
//                     msgType: 'gameUpdate',
//                     gameType: 'chess',
//                     content: { fen },
//                   });
//                 }}
//               />
//             ) : (
//               <>
//                 {peerStatus.joined_room ? (
//                   <div style={{ display: 'flex' }}>
//                     <button type="button" onClick={() => start()}>
//                       Start RTC
//                     </button>
//                   </div>
//                 ) : (
//                   <div style={{ display: 'flex' }}>
//                     <p>Rooms:</p>
//                     {Object.keys(peerStatus.all_rooms).map((room) => (
//                       <div
//                         style={{
//                           display: 'flex',
//                           flexDirection: 'row',
//                         }}
//                         key={room}
//                       >
//                         <button type="button" onClick={() => joinRoom(room)}>
//                           Join $
//                           {room}
//                           {' '}
//                           Room
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </>
//             )}
//           </>
//         )}
//       />
//     </>
//   );
// });
