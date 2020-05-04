import React, { useState } from 'react';
import { PeerMessage } from 'src/services/peer2peer/records/PeerMessagingPayload';
import { Peer2PeerProvider } from './Peer2PeerProvider';
import { AVStream } from '../AVStream';

export default {
  component: Peer2PeerProvider,
  title: 'Components/Peer2PeerProvider',
};

export const defaultStory = () =>
  React.createElement(() => {
    const [msgHistory, setMsgHistory] = useState<PeerMessage[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');

    return (
      <Peer2PeerProvider
        onPeerMsgReceived={(msg) => {
          setMsgHistory([...msgHistory, msg]);
        }}
        render={({
          joinRoom,
          start,
          stop,
          peerStatus,
          localStream,
          remoteStreams,
          sendPeerData,
        }) => (
          <>
            {peerStatus.joined_room ? (
              <div>
                <p>
                  Me:
                  {peerStatus.me}
                </p>
                <p>
                  Room Joined
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
                    <p key={peer}>{`${peer}, `}</p>
                  ))}
                </p>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  {localStream ? (
                    <button type="button" onClick={stop}>
                      Stop Chat
                    </button>
                  ) : (
                    <button type="button" onClick={start}>
                      Start Chat
                    </button>
                  )}
                </div>
                {localStream && (
                  <div
                    style={{
                      height: 200,
                      display: 'flex',
                      flexDirection: 'row',
                      marginBottom: 60,
                    }}
                  >
                    <AVStream stream={localStream} autoPlay muted />
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                    >
                      {msgHistory.map((msg, i) => (
                        <div key={`${msg.timestamp + i}`}>
                          <small>
                            {msg.fromPeerId === peerStatus.me
                              ? 'Me'
                              : msg.fromPeerId}
                            :
                          </small>
                          {msg.content}
                        </div>
                      ))}

                      <div style={{
                        display: 'block',
                      }}
                      >
                        <textarea
                          value={currentMessage}
                          onChange={(event) => {
                            setCurrentMessage(event.target.value || '');
                          }}
                        />
                        <button
                          type="button"
                          disabled={currentMessage.length === 0}
                          onClick={() => {
                            sendPeerData({
                              msgType: 'chatMessage',
                              content: currentMessage,
                            });

                            const myMsg: PeerMessage = {
                              fromPeerId: peerStatus.me,
                              toPeerId: peerStatus.me,
                              content: currentMessage,
                              timestamp: String(new Date().getTime),
                            };

                            setCurrentMessage('');

                            setMsgHistory([...msgHistory, myMsg]);
                          }}
                        >
                          Send Message
                        </button>
                      </div>
                    </div>
                  </div>

                )}
                <div
                  style={{
                    height: 200,
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  {Object.values(remoteStreams || {}).map(
                    ({ peerId, stream }) => (
                      <AVStream key={peerId} stream={stream} autoPlay muted />
                    ),
                  )}
                </div>
              </div>
            ) : (
              <>
                <p>
                  Me:
                  {peerStatus.me}
                </p>
                <p>
                  All Peer Count:
                  {peerStatus.count}
                </p>
                <div>
                  All Peers Online:
                  {' '}
                  {Object.keys(peerStatus.peers).map((peer) => (
                    <div key={peer}>
                      {peer}
                      ,
                      {' '}
                    </div>
                  ))}
                </div>
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
    );
  });

type PeerWindowProps = {
  windowId: string;
};
const PeerWindow: React.FunctionComponent<PeerWindowProps> = (props) => {
  // console.log('works');
  const [msgHistory, setMsgHistory] = useState<PeerMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [started, setStarted] = useState(false);

  return (
    <Peer2PeerProvider
      wssUrl="ws://127.0.0.1:7777"
      // wssUrl="wss://dstnd-server.herokuapp.com"
      iceServersURLs={['stun:stun.ideasip.com']}
      onPeerMsgSent={(msg) => {
        // console.log('Peer Msg received [at story]', msg);
        setMsgHistory([...msgHistory, msg]);
      }}
      render={({
        start,
        stop,
        peerStatus,
        joinRoom,
        localStream,
        sendPeerData,
      }) => (
        <>
          {peerStatus.joined_room ? (
            <div>
              <div>
                <p>{`Me: ${peerStatus.me}`}</p>
                {started ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        stop();
                        setStarted(false);
                      }}
                    >
                      Stop Chat
                    </button>

                    <div style={{}}>
                      {msgHistory.map((msg, i) => (
                        <div key={`${msg.timestamp + i}`}>
                          <small>
                            {msg.fromPeerId === peerStatus.me
                              ? 'Me'
                              : msg.fromPeerId}
                            :
                          </small>
                          {msg.content}
                        </div>
                      ))}
                    </div>
                    <textarea
                      value={currentMessage}
                      onChange={(event) => {
                        setCurrentMessage(event.target.value || '');
                      }}
                    />
                    <button
                      type="button"
                      disabled={currentMessage.length === 0}
                      onClick={() => {
                        sendPeerData({
                          msgType: 'chatMessage',
                          content: currentMessage,
                        });

                        const myMsg: PeerMessage = {
                          fromPeerId: peerStatus.me,
                          toPeerId: peerStatus.me,
                          content: currentMessage,
                          timestamp: String(new Date().getTime),
                        };

                        setCurrentMessage('');

                        setMsgHistory([...msgHistory, myMsg]);
                      }}
                    >
                      Send Message
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      start();
                      setStarted(true);
                    }}
                  >
                    Start Chat
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <p>
                Me:
                {peerStatus.me}
              </p>
              <p>
                All Peer Count:
                {peerStatus.count}
              </p>
              <div>
                All Peers Online:
                {' '}
                {Object.keys(peerStatus.peers).map((peer) => (
                  <div key={peer}>
                    {peer}
                    ,
                    {' '}
                  </div>
                ))}
              </div>
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
  );
};

export const chatOnly = () =>
  React.createElement(() => {
    const [windowIds] = useState<{ [k: string]: null }>({
      w1: null,
      w2: null,
      w3: null,
    });

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        {Object.keys(windowIds).map((key) => (
          <div key={key} style={{ marginRight: 50 }}>
            <PeerWindow windowId={key} />
          </div>
        ))}
      </div>
    );
  });
