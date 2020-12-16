/* eslint-disable import/no-extraneous-dependencies */
import { Grommet } from 'grommet';
import React, { useEffect, useReducer, useState } from 'react';
import {
  Streamer,
  StreamersMap,
} from 'src/components/StreamingBox/types';
import { getRandomInt, range } from 'src/lib/util';
import { PeerMocker } from 'src/mocks/records/PeerMocker';
import { WithLocalStream } from 'src/storybook/WithLocalStream';
import { defaultTheme } from 'src/theme';
import { Reel } from './Reel';
import { reducer, initialState, initAction, focusAction, updateAction } from '../../reducer';
import { Button } from 'src/components/Button';

export default {
  component: Reel,
  title: 'components/StreamingBox/components/Reel',
};

const peerMock = new PeerMocker();

// const names = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
const getPeers = (stream: MediaStream, count: number) =>
  range(count).map((_, i) => {
    const record = peerMock.withChannels({
      streaming: {
        on: true,
        type: 'audio-video',
        stream,
      },
    });

    return {
      ...record,
      user: {
        ...record.user,
      },
    };
  });

const Component = (p: {
  streamersMap: StreamersMap;

  myStreamingConfig: Streamer;
  onRemove: (userId: Streamer['user']['id']) => void;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch(initAction({ streamersMap: p.streamersMap }));
  }, []);

  useEffect(() => {
    dispatch(updateAction({ streamersMap: p.streamersMap }));
  }, [p.streamersMap]);

  if (!state.ready) {
    return null;
  }

  return (
    <Grommet theme={defaultTheme}>
      <div
        style={{
          display: 'flex',
        }}
      >
        <div
          style={{
            width: '100px',
          }}
        >
          <pre>Focused: {state.inFocus.user.id}</pre>
          <Reel
            reel={state.reel}
            onClick={(userId) => {
              dispatch(focusAction({ userId }));
            }}
          />
        </div>
      </div>
      <div>
        <Button
          label="Remove Foocused Peer"
          onClick={() => {
            p.onRemove(state.inFocus.user.id);
          }}
        />
      </div>
    </Grommet>
  );
};

export const defaultStory = () => (
  <WithLocalStream
    constraints={{ audio: true, video: true }}
    render={(stream) =>
      React.createElement(() => {
        const peers = getPeers(stream, 4);
        const streamersList = peers.map(
          (next) =>
            ({
              streamingConfig: {
                on: true,
                stream,
                type: 'audio-video',
              },
              user: next.user,
            } as const)
        );

        const [streamersMap, setStreamersMap] = useState(
          streamersList.reduce(
            (prev, next) => ({
              ...prev,
              [next.user.id]: next,
            }),
            {} as StreamersMap
          )
        );

        const myPeer = getPeers(stream, 1)[0];
        const myStreamingConfig = {
          streamingConfig: {
            on: true,
            stream,
            type: 'audio-video',
          },
          user: myPeer.user,
        } as const;

        return (
          <Grommet theme={defaultTheme}>
            <div
              style={{
                display: 'flex',
              }}
            >
              <div
                style={{
                  width: '100px',
                }}
              >
                <Component
                  streamersMap={streamersMap}
                  myStreamingConfig={myStreamingConfig} 
                  onRemove={(userId) => {
                    setStreamersMap((prev) => {
                      if (!userId) {
                        return prev;
                      }

                      const { [userId]: removed, ...rest } = prev;

                      return rest;
                    });
                  }}
                />
              </div>
              <div>
                <pre>
                  {JSON.stringify(
                    Object.values(streamersMap).map((p) => ({
                      id: p.user.id,
                      name: p.user.name,
                    })),
                    null,
                    2
                  )}
                </pre>
                <Button
                  label="Add Peer"
                  onClick={() => {
                    const peer = getPeers(stream, 1)[0];

                    setStreamersMap((prev) => ({
                      ...prev,
                      [peer.user.id]: {
                        user: peer.user,
                        streamingConfig: {
                          on: true,
                          stream,
                          type: 'audio-video',
                        },
                      },
                    }));
                  }}
                />
                <Button
                  label="Remove Random Peer"
                  onClick={() => {
                    setStreamersMap((prev) => {
                      const peerIds = Object.keys(prev);

                      if (peerIds.length === 1) {
                        return prev;
                      }

                      const randomPeerId = peerIds[getRandomInt(0, peerIds.length - 1)];

                      const { [randomPeerId]: removed, ...rest } = prev;

                      return rest;
                    });
                  }}
                />
              </div>
            </div>
          </Grommet>
        );
      })
    }
  />
);
