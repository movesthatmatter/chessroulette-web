import React, { useState, useEffect } from 'react';
import { LocalStreamClient } from 'src/services/peer2peer/LocalStreamClient';
import { Peer2PeerProvider } from './Peer2PeerProvider';
import { AVStream } from '../AVStream';

export default {
  component: Peer2PeerProvider,
  title: 'Components/Peer2PeerProvider',
};

const streamClient = new LocalStreamClient();

export const defaultStory = () => React.createElement(() =>
// const [stream, setStream] = useState<MediaStream | undefined>();

// useEffect(() => {
//   (async () => {
//     setStream(await streamClient.start());
//   })();
// }, []);

  (
    <Peer2PeerProvider
      wssUrl="ws://127.0.0.1:7777"
      // wssUrl="wss://dstnd-server.herokuapp.com"
      iceServersURLs={[
        'stun:stun.ideasip.com',
      ]}
      render={({
        joinRoom, start, stop, peerStatus, localStream, remoteStreams,
      }) => (
        <>
          {peerStatus.joined_room
            ? (
              <div>
                <p>
                  Me:
                  {' '}
                  {peerStatus.me}
                </p>
                <p>
                  Room Joined
                  {' '}
                  {peerStatus.joined_room.id}
                </p>
                <p>
                  Room Peer Count:
                  {' '}
                  {Object.keys(peerStatus.joined_room.peers).length}
                </p>
                <p>
                  Room Peers Online:
                  {' '}
                  {Object.keys(peerStatus.joined_room.peers).map((peer) => (
                    <div key={peer}>
                      <p>
                        {peer}
                        ,
                        {' '}
                      </p>
                    </div>
                  ))}
                </p>
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}
                >
                  {localStream
                    ? (
                      <button type="button" onClick={stop}>
                        Stop Chat
                      </button>
                    )
                    : (
                      <button type="button" onClick={start}>
                        Start Chat
                      </button>
                    )}
                </div>
                {localStream && (
                  <div style={{
                    height: 200,
                    display: 'flex',
                    flexDirection: 'row',
                    marginBottom: 60,
                  }}
                  >
                    {/* <VideoChat
                    title={peerStatus.me}
                    stream={localStream}
                  /> */}
                  </div>
                )}
                <div style={{
                  height: 200,
                  display: 'flex',
                  flexDirection: 'row',
                }}
                >
                  {Object.values(remoteStreams || {}).map(({ peerId, stream }) => (
                    <div />
                  // <VideoChat
                  //   key={peerId}
                  //   title={peerId}
                  //   stream={stream}
                  // />
                  ))}
                </div>
              </div>
            ) : (
              <>
                {console.log('peer status', peerStatus)}
                {/* <TouchableOpacity onPress={() => joinRoom()}>
                <p>Start P2P</p> */}
                {/* </TouchableOpacity> */}
                <p>
                  Me:
                  {' '}
                  {peerStatus.me}
                </p>
                <p>
                  All Peer Count:
                  {' '}
                  {peerStatus.count}
                </p>
                <p>
                  All Peers Online:
                  {' '}
                  {Object.keys(peerStatus.peers).map((peer) => (
                    <div key={peer}>
                      <p>
                        {peer}
                        ,
                        {' '}
                      </p>
                    </div>
                  ))}
                </p>
                <div style={{ display: 'flex' }}>
                  <p>Rooms:</p>
                  {Object.keys(peerStatus.all_rooms).map((room) => (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                      }}
                      key={room}
                    >
                      <button type="button" onClick={() => joinRoom(room)}>
                        Join $
                        {room}
                        {' '}
                        Room
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
        </>
      )}
    />
  ));
