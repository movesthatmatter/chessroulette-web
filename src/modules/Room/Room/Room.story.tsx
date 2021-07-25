/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from 'react';
// import { JoinedRoomContainer } from './JoinedRoomContainer';
// import { PeerConsumer, PeerProvider } from 'src/providers/PeerProvider';
// import { authenticateAsExistentGuest } from 'src/services/Authentication/resources';
// import { GuestUserRecord, PeerRecord } from 'dstnd-io';
// import { quickPair } from 'src/resources/resources';
// import { SocketConsumer, SocketProvider } from 'src/providers/SocketProvider';
// import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
// import { AuthenticationProvider, selectAuthentication } from 'src/services/Authentication';
// import { Grommet } from 'grommet';
// import { defaultTheme } from 'src/theme';
// import { getRandomInt } from 'src/lib/util';
// import { Button } from 'src/components/Button';
// import { useSelector } from 'react-redux';
// import { RoomCredentials } from 'src/providers/PeerProvider';
// import { UserRecordMocker } from 'src/mocks/records';
// import { useJoinedRoom } from '../hooks/useJoinedRoom';

// export default {
//   component: JoinedRoomContainer,
//   title: 'modules/Room/JoinedRoomContainer',
// };

// const userMocker = new UserRecordMocker();



// // TODO: This needs to be updated to the latest usePeerState etc hooks so it cleans up the code a bit!


// const DummyRoomContainer: React.FC<{
//   withControls?: boolean;
// }> = ({
//   withControls = false,
// }) => {
//   const [peer, setPeer] = useState<PeerRecord>();
//   const [challengeCreated, setChallengeCreated] = useState(false);
//   const [show, setShow] = useState(true);
//   const [showRoom, setShowRoom] = useState(true);
//   const [roomCredentials, setRoomCredentials] = useState<RoomCredentials>();
//   const auth = useSelector(selectAuthentication);

//   useEffect(() => {
//     if (!peer || challengeCreated) {
//       return;
//     }

//     setTimeout(() => {
//       quickPair({
//         userId: peer.user.id,
//         gameSpecs: {
//           timeLimit: 'bullet1',
//           preferredColor: 'white',
//         },
//       }).map((r) => {
//         if (r.matched) {
//           setRoomCredentials({
//             id: r.room.id,
//             ...(r.room.type === 'private' && {
//               code: r.room.code,
//             }),
//           });
//         }

//         setChallengeCreated(true);
//       });
//     }, getRandomInt(200, 1000));
//   }, [peer]);

//   if (auth.authenticationType === 'none') {
//     return null;
//   }

//   const { user } = auth;

//   if (!show) {
//     return (
//       <Button
//         label={show ? 'Simulate Exit Window' : 'Simulate Enter Window'}
//         onClick={() => {
//           setShow(!show);
//         }}
//       />
//     );
//   }

//   return (
//     <SocketConsumer
//       onMessage={(msg) => {
//         if (msg.kind === 'iam') {

//         }
//         // if (msg.kind === 'challengeAccepted') {
//         //   setRoomCredentials({
//         //     id: msg.content.room.id,
//         //     ...(msg.content.room.type === 'private' && {
//         //       code: msg.content.room.code,
//         //     }),
//         //   });
//         // }
//       }}
//       render={() => (
//         <>
//           {/* <small>
//             <pre>
//               User:{' '}
//               <b>
//                 {user.name} ({user.id})
//               </b>
//             </pre>
//           </small> */}
//           {withControls && (
//             <>
//               <Button
//                 label="Simulate Refresh"
//                 onClick={() => {
//                   setShow(false);
//                   setTimeout(() => {
//                     setShow(true);
//                   }, 500);
//                 }}
//               />
//               <Button
//                 label={show ? 'Simulate Exit Window' : 'Simulate Enter Window'}
//                 onClick={() => {
//                   setShow(!show);
//                 }}
//               />
//               <Button
//                 label={showRoom ? 'Simulate Leave Room' : 'Simulate Enter Room'}
//                 onClick={() => {
//                   setShowRoom(!showRoom);
//                 }}
//               />
//             </>
//           )}
//           <PeerProvider>
//             <PeerConsumer
//               onReady={(p) => {
//                 setPeer(p.me);
//               }}
//               render={(p) => (
//                 <>
//                   {/* <pre>roomCredentials: {JSON.stringify(roomCredentials, null, 2) || '{}'}</pre>
//                   <pre>{JSON.stringify(user, null, 2)}</pre> */}
//                   {showRoom && p.state === 'joined' && <JoinedRoomContainer joinedRoom={p.room} />}
//                 </>
//               )}
//             />
//           </PeerProvider>
//         </>
//       )}
//     />
//   );
// };

// export const defaultStory = () =>
//   React.createElement(() => {
//     const [userA, setUserA] = useState<GuestUserRecord>();
//     const [userB, setUserB] = useState<GuestUserRecord>();

//     const guestA = userMocker.withProps(
//       {
//         name: 'UserA',
//         id: '1',
//       },
//       true
//     );

//     const guestB = userMocker.withProps(
//       {
//         name: 'UserB',
//         id: '2',
//       },
//       true
//     );

//     useEffect(() => {
//       (async () => {
//         (await authenticateAsExistentGuest({ guestUser: guestA })).map((user) => {
//           setUserA(user.guest);
//         });

//         (await authenticateAsExistentGuest({ guestUser: guestB })).map((user) => {
//           // Simulate a delay in joining the room as 2nd Peer
//           setTimeout(() => {
//             setUserB(user.guest);
//           }, 100);
//         });
//       })();
//     }, []);

//     return (
//       <Grommet theme={defaultTheme} full>
//         {userA && (
//           <StorybookReduxProvider
//             initialState={{
//               authentication: {
//                 authenticationType: 'guest',
//                 user: userA,
//               } as const,
//             }}
//           >
//             <AuthenticationProvider>
//               <SocketProvider>
//                 <DummyRoomContainer />
//               </SocketProvider>
//             </AuthenticationProvider>
//           </StorybookReduxProvider>
//         )}
//         <div style={{ display: 'none' }}>
//           {/* This is needed in order to have a joined rooom */}
//             {userB && (
//               <StorybookReduxProvider
//                 initialState={{
//                   authentication: {
//                     authenticationType: 'guest',
//                     user: userB,
//                   } as const,
//                 }}
//               >
//                 <AuthenticationProvider>
//                   <SocketProvider>
//                     <DummyRoomContainer />
//                   </SocketProvider>
//                 </AuthenticationProvider>
//               </StorybookReduxProvider>
//             )}
//           </div>
//       </Grommet>
//     );
//   });

// export const playRoomDualView = () =>
//   React.createElement(() => {
//     const [userA, setUserA] = useState<GuestUserRecord>();
//     const [userB, setUserB] = useState<GuestUserRecord>();

//     const guestA = userMocker.withProps(
//       {
//         name: 'UserA',
//         id: '1',
//       },
//       true
//     );

//     const guestB = userMocker.withProps(
//       {
//         name: 'UserB',
//         id: '2',
//       },
//       true
//     );

//     useEffect(() => {
//       (async () => {
//         (await authenticateAsExistentGuest({ guestUser: guestA })).map((user) => {
//           setUserA(user.guest);
//         });

//         (await authenticateAsExistentGuest({ guestUser: guestB })).map((user) => {
//           // Simulate a delay in joining the room as 2nd Peer
//           setTimeout(() => {
//             setUserB(user.guest);
//           }, 100);
//         });
//       })();
//     }, []);

//     return (
//       <Grommet theme={defaultTheme}>
//         <div
//           style={{
//             width: '100%',
//             display: 'flex',
//             flexDirection: 'row',
//           }}
//         >
//           <div
//             style={{
//               width: '100%',
//               height: '500px',
//               marginRight: '10px',
//               border: '1px solid #efefef',
//             }}
//           >
//             {userA && (
//               <StorybookReduxProvider
//                 initialState={{
//                   authentication: {
//                     authenticationType: 'guest',
//                     user: userA,
//                   } as const,
//                 }}
//               >
//                 <AuthenticationProvider>
//                   <SocketProvider>
//                     <DummyRoomContainer withControls/>
//                   </SocketProvider>
//                 </AuthenticationProvider>
//               </StorybookReduxProvider>
//             )}
//           </div>
//           <div
//             style={{
//               width: '100%',
//               height: '500px',
//               border: '1px solid #efefef',
//             }}
//           >
//             {userB && (
//               <StorybookReduxProvider
//                 initialState={{
//                   authentication: {
//                     authenticationType: 'guest',
//                     user: userB,
//                   } as const,
//                 }}
//               >
//                 <AuthenticationProvider>
//                   <SocketProvider>
//                     <DummyRoomContainer withControls/>
//                   </SocketProvider>
//                 </AuthenticationProvider>
//               </StorybookReduxProvider>
//             )}
//           </div>
//         </div>
//       </Grommet>
//     );
//   });
