/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from 'react';
import { Grommet } from 'grommet';
import { defaultTheme } from 'src/theme';
import { ChessGame } from 'src/modules/Games/Chess';
import { StreamingBox } from 'src/components/StreamingBox';
import { WithLocalStream } from 'src/storybook/WithLocalStream';
import { PeerMocker } from 'src/mocks/records/PeerMocker';
import { RoomMocker } from 'src/mocks/records/RoomMocker';
import { GameRoomLayout } from './GameRoomLayout';
import { Chat } from 'src/components/Chat/Chat';
import { action } from '@storybook/addon-actions';
import { ChatHistoryRecord } from 'dstnd-io';
import { toISODateTime } from 'src/lib/date/ISODateTime';
import { minutes, seconds } from 'src/lib/time';

export default {
  component: GameRoomLayout,
  title: 'modules/GameRoomV2/GameRoomLayout',
};

const peerMock = new PeerMocker();
const roomMocker = new RoomMocker();

const peerA = peerMock.record();
const peerB = peerMock.record();

const now = new Date().getTime();

export const initHistory: ChatHistoryRecord = {
  id: '0',
  usersInfo: {
    [peerA.id]: peerA.user,
    [peerB.id]: peerB.user,
  },
  messages: [
    {
      content: 'Hey',
      fromUserId: peerA.user.id,
      sentAt: toISODateTime(new Date(now - minutes(3))),
    },
    {
      content: 'Hey there',
      fromUserId: peerB.user.id,
      sentAt: toISODateTime(new Date(now - (minutes(3) + seconds(14)))),
    },
    {
      content: 'Whats good?',
      fromUserId: peerA.user.id,
      sentAt: toISODateTime(new Date(now - (minutes(3) + seconds(44)))),
    },
    {
      content: 'Did you do your homework?',
      fromUserId: peerA.user.id,
      sentAt: toISODateTime(new Date(now - (minutes(2) + seconds(4)))),
    },
    {
      content: 'Oh you know me. I tried to but I couldnt stop playing chess',
      fromUserId: peerB.user.id,
      sentAt: toISODateTime(new Date(now - (minutes(2) + seconds(24)))),
    },
    {
      content: '😀',
      fromUserId: peerB.user.id,
      sentAt: toISODateTime(new Date(now - (minutes(1) + seconds(51)))),
    },
    {
      content: 'Of course hahaha! 😂😂😂',
      fromUserId: peerB.user.id,
      sentAt: toISODateTime(new Date(now - (minutes(1) + seconds(13)))),
    },
  ],
};

export const empty = () => (
  <Grommet theme={defaultTheme} full>
    <div style={{
      width: '100%',
      height: '100%',
      background: '#ededed',
    }}>
      <GameRoomLayout
        topHeight={0}
        getTopComponent={() => null}
        bottomHeight={0}
        getBottomComponent={() => null}
        getGameComponent={(dimensions) => (
          <div style={{
            width: dimensions.width,
            height: dimensions.height,
            backgroundColor: 'red',
          }}/>
        )}
        getLeftSideComponent={(dimensions) => (
          <div style={{
            width: dimensions.width,
            height: dimensions.height,
            backgroundColor: 'blue',
          }}/>
        )}
        getRightSideComponent={(dimensions) => (
          <div style={{
            width: dimensions.width,
            height: dimensions.height + dimensions.verticalPadding,
          }}/>
        )}
      />
    </div>
  </Grommet>
)

export const withChessGame = () => (
  <Grommet theme={defaultTheme} full>
    <WithLocalStream render={(stream) => {
      const me = peerMock.withChannels({
        streaming: {
          on: true,
          type: 'audio-video',
          stream,
        },
      });

      const opponent = peerMock.withChannels({
        streaming: {
          on: true,
          type: 'audio-video',
          stream,
        },
      });

      const publicRoom = roomMocker.withProps({
        me,
        peers: {
          [opponent.id]: opponent,
        },
        name: 'Valencia',
        type: 'public',
      });

      publicRoom

      return (
        <div style={{ width: '100%', height: '100%' }}>
          <GameRoomLayout
            ratios={{
              leftSide: 1.2,
              gameArea: 3,
              rightSide: 2,
            }}
            minSpaceBetween={30}
            topHeight={80}
            getTopComponent={() => <div style={{
              height: '100%',
              width: '100%',
              background: 'grey',
            }}/>}
            bottomHeight={100}
            getBottomComponent={() => <div style={{
              height: '100%',
              width: '100%',
              background: 'grey',
            }}/>}
            getGameComponent={(dimensions) => (
              <ChessGame
                homeColor="black"
                playable
                pgn=""
                getBoardSize={() => dimensions.width}
              />
            )}
            getLeftSideComponent={() => (<></>)}
            getRightSideComponent={(dimensions) => (
              <div style={{
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                overflow: 'hidden',
                alignItems: 'stretch',
                height: '100%', 
              }}>
                <StreamingBox
                  room={publicRoom}
                  width={dimensions.width}
                />

                <div
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    overflow: 'hidden', 
                  }}
                >
                    <Chat 
                      myId="1"
                      history={initHistory}
                      onSend={action('on send')}
                      inputContainerStyle={{
                        height: `${dimensions.verticalPadding - 32}px`,
                        marginBottom: '32px',
                      }}
                    />
                  </div>
              </div>
            )}
          />
        </div>
      );
    }}
    />
  </Grommet>
);