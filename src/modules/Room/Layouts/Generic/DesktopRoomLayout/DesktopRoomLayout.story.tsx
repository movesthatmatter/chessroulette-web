/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import React, { useRef } from 'react';
import { StreamingBox } from 'src/components/StreamingBox';
import { WithLocalStream } from 'src/storybook/WithLocalStream';
import { PeerMocker } from 'src/mocks/records/PeerMocker';
import { RoomMocker } from 'src/mocks/records/RoomMocker';
import { DesktopRoomLayout } from './DesktopRoomLayout';
import { Chat } from 'src/modules/Chat/Chat';
import { action } from '@storybook/addon-actions';
import { ChatHistoryRecord } from 'dstnd-io';
import { toISODateTime } from 'src/lib/date/ISODateTime';
import { minutes, seconds } from 'src/lib/time';
import { AspectRatio, AspectRatioExplicit } from 'src/components/AspectRatio';
import { useContainerDimensions } from 'src/components/ContainerWithDimensions';
import { GameMocker } from 'src/mocks/records';
import { ChessBoard } from 'src/modules/Games/Chess/components/ChessBoard';

export default {
  component: DesktopRoomLayout,
  title: 'modules/Room/LayoutProvider/Generic/Room/Desktop',
};

const peerMock = new PeerMocker();
const roomMocker = new RoomMocker();
const gameMocker = new GameMocker();

const peerA = peerMock.record();
const peerB = peerMock.record();

const now = new Date().getTime();

const initHistory: ChatHistoryRecord = {
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
  <>
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#ededed',
      }}
    >
      <DesktopRoomLayout
        topHeight={0}
        renderTopComponent={() => null}
        bottomHeight={0}
        renderBottomComponent={() => null}
        ratios={{
          leftSide: 1.2,
          mainArea: 3,
          rightSide: 2,
        }}
        minSpaceBetween={30}
        renderActivityComponent={({ container }) => (
          <div
            style={{
              width: container.width,
              height: container.height + container.verticalPadding,
              background: 'cyan',
              position: 'relative',
              // opacity:
            }}
          >
            <div
              style={{
                width: container.width,
                height: container.height,
                background: 'blue',
                opacity: 0.5,
                position: 'absolute',
              }}
            />
          </div>
        )}
        renderRightSideComponent={({ container }) => (
          <div
            style={{
              width: container.width,
              height: container.height + container.verticalPadding,
              background: 'yellow',
              position: 'relative',
              // opacity:
            }}
          >
            <div
              style={{
                width: container.width,
                height: container.height,
                background: 'orange',
                opacity: 0.5,
                position: 'absolute',
              }}
            />
          </div>
        )}
      />
    </div>
  </>
);

export const withChessGame = () => (
  <>
    <WithLocalStream
      render={(stream) => {
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

        publicRoom;

        return (
          <div style={{ width: '100%', height: '100%' }}>
            <DesktopRoomLayout
              ratios={{
                leftSide: 1.2,
                mainArea: 3,
                rightSide: 2,
              }}
              minSpaceBetween={30}
              topHeight={80}
              renderTopComponent={() => (
                <div
                  style={{
                    height: '100%',
                    width: '100%',
                    background: 'grey',
                  }}
                />
              )}
              bottomHeight={100}
              renderBottomComponent={() => (
                <div
                  style={{
                    height: '100%',
                    width: '100%',
                    background: 'grey',
                  }}
                />
              )}
              renderActivityComponent={({ container }) => {
                const game = gameMocker.record();

                return (
                  <ChessBoard
                    type="play"
                    playableColor="black"
                    playable
                    pgn={game.pgn}
                    id={game.id}
                    onMove={action('on move')}
                    size={container.width}
                  />
                );
              }}
              // renderLeftSideComponent={() => <></>}
              renderRightSideComponent={({ container }) => (
                <div
                  style={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    overflow: 'hidden',
                    alignItems: 'stretch',
                    height: '100%',
                  }}
                >
                  <StreamingBox room={publicRoom} width={container.width} />

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
                        height: `${container.verticalPadding - 32}px`,
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
  </>
);

const LayoutComponent: React.FC<{
  aspectRatio: AspectRatioExplicit;
  containerWidth: number;
  top: number;
  bottom: number;
}> = (props) => {
  const containerRef = useRef(null);
  const containerDimensions = useContainerDimensions(containerRef);

  return (
    <div
      style={{
        border: '1px solid grey',
        marginRight: '8px',
      }}
    >
      <AspectRatio aspectRatio={props.aspectRatio} width={props.containerWidth}>
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
          ref={containerRef}
        >
          {containerDimensions.updated && (
            <DesktopRoomLayout
              topHeight={props.top}
              renderTopComponent={(d) => (
                <div
                  style={{
                    height: props.top,
                    background: '#efefef',
                    opacity: 0.7,
                    zIndex: 999,
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 8,
                      right: 8,
                      zIndex: 999,
                      height: 80,
                    }}
                  >
                    <p
                      style={{
                        fontSize: '12px',
                        lineHeight: '1.5em',
                        margin: 0,
                        padding: 0,
                      }}
                    >
                      Container: {containerDimensions.width}px / {containerDimensions.height}px (
                      {props.aspectRatio?.width}/{props.aspectRatio?.height})
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        lineHeight: '1.5em',
                        margin: 0,
                        padding: 0,
                      }}
                    >
                      Top: {d.top.width}px / {d.top.height}px | Bottom: {d.bottom.width}px /{' '}
                      {d.bottom.height}px | Main: {d.main.width}px / {d.main.height}px
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        lineHeight: '1.5em',
                        margin: 0,
                        padding: 0,
                      }}
                    >
                      Width Occupancy:{' '}
                      {Number(
                        ((d.center.width + d.left.width + d.right.width + 60) /
                          containerDimensions.width) *
                          100
                      ).toFixed(2)}
                      %
                    </p>
                  </div>
                </div>
              )}
              bottomHeight={props.bottom}
              renderBottomComponent={() => (
                <div
                  style={{
                    height: props.bottom,
                    background: '#efefef',
                    opacity: 0.7,
                  }}
                />
              )}
              ratios={{
                leftSide: 1.2,
                mainArea: 3,
                rightSide: 2,
              }}
              minSpaceBetween={30}
              renderActivityComponent={({ container }) => (
                <div
                  style={{
                    width: container.width,
                    height: container.height + container.verticalPadding,
                    background: 'cyan',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: container.width,
                      height: container.height,
                      background: 'blue',
                      opacity: 0.5,
                      position: 'absolute',
                    }}
                  />
                </div>
              )}
              renderRightSideComponent={({ container }) => (
                <div
                  style={{
                    width: container.width,
                    height: container.height + container.verticalPadding,
                    background: 'yellow',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: container.width,
                      height: container.height,
                      background: 'orange',
                      opacity: 0.5,
                      position: 'absolute',
                    }}
                  />
                </div>
              )}
            />
          )}
        </div>
      </AspectRatio>
    </div>
  );
};

export const multipleResolutions = () => (
  <>
    <div style={{display:'flex'}}>
      <LayoutComponent
        containerWidth={400}
        top={80}
        bottom={30}
        aspectRatio={{ width: 4, height: 3 }}
      />
      <LayoutComponent
        containerWidth={400}
        top={80}
        bottom={30}
        aspectRatio={{ width: 4, height: 4 }}
      />
      <LayoutComponent
        containerWidth={400}
        top={80}
        bottom={30}
        aspectRatio={{ width: 16, height: 9 }}
      />
      <LayoutComponent
        containerWidth={400}
        top={80}
        bottom={30}
        aspectRatio={{ width: 14, height: 10 }}
      />
      <LayoutComponent
        containerWidth={400}
        top={80}
        bottom={30}
        aspectRatio={{ width: 16, height: 10 }}
      />
      <LayoutComponent
        containerWidth={400}
        top={80}
        bottom={30}
        aspectRatio={{ width: 7, height: 5 }}
      />
      <LayoutComponent
        containerWidth={400}
        top={0}
        bottom={0}
        aspectRatio={{ width: 400, height: 115 }}
      />
      <LayoutComponent
        containerWidth={400}
        top={80}
        bottom={30}
        aspectRatio={{ width: 4, height: 3 }}
      />
    </div>
  </>
);
