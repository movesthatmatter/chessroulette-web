/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { PeerProvider } from './PeerProvider';
import { SocketProvider } from '../SocketProvider';
import { FaceTime } from '../FaceTimeArea';


export default {
  component: PeerProvider,
  title: 'Components/PeerProvider',
};

export const defaultStory = () => (
  <SocketProvider>
    <PeerProvider
      roomCredentials={{
        id: '1',
      }}
      render={({ room }) => (
        <>
          <div>
            {`Me: ${room.me.name}(${room.me.id})`}
            {room.me.connection.channels.streaming.on ? (
              <FaceTime
                streamConfig={room.me.connection.channels.streaming}
                muted
              />
            ) : (
              <p>Streaming not on</p>
            )}
          </div>
          <p>Peers:</p>
          <ul>
            {Object.values(room.peers).map(({ id, name, connection }) => (
              <div key={id}>
                <div>{`${name}(${id})`}</div>
                {connection.channels.streaming.on ? (
                  <FaceTime streamConfig={connection.channels.streaming} />
                ) : (
                  <div>Streaming not on</div>
                )}
              </div>
            ))}
          </ul>
        </>
      )}
    />
  </SocketProvider>
);

// export const withRoomInfoDisplayStory = () => (
//   <SocketProvider>
//     <PeerProvider render={(p) => (
//       <>
//         <p>
//           {`Me: ${room.me.name}(${room.me.id})`}
//         </p>
//         <RoomInfoDisplay
//           me={}
//         />
//       </>
//     )}
//     />
//   </SocketProvider>
// );
