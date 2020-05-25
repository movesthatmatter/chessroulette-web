/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { PeerProvider } from './PeerProvider';
import { SocketProvider } from '../SocketProvider';
import { RoomInfoDisplay } from '../RoomInfoDisplay';
import { AVStream } from '../AVStream';
import { FaceTime } from '../FaceTimeArea';


export default {
  component: PeerProvider,
  title: 'Components/PeerProvider',
};

export const defaultStory = () => (
  <SocketProvider>
    <PeerProvider render={(p) => (
      <>
        <div>
          {`Me: ${p.me.name}(${p.me.id})`}
          {p.me.connection.channels.streaming.on ? (
            <FaceTime streamConfig={p.me.connection.channels.streaming} />
          ) : (
            <p>Streaming not on</p>
          )}
        </div>
        <p>Peers:</p>
        <ul>
          {Object.values(p.peers).map(({ id, name, connection }) => (
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
//           {`Me: ${p.me.name}(${p.me.id})`}
//         </p>
//         <RoomInfoDisplay
//           me={}
//         />
//       </>
//     )}
//     />
//   </SocketProvider>
// );
