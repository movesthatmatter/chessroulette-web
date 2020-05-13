/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { WithLocalStream } from 'src/storybook/WithLocalStream';
import useWindowSize from '@react-hook/window-size';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';
import { TV } from './TV';
import { getBoardSize } from '../../util';


export default {
  component: TV,
  title: 'modules/GameRoom/components/TV',
};

export const withStream = () => React.createElement(() => {
  const [screenWidth, screenHeight] = useWindowSize();

  return (
    <WithLocalStream
      render={(stream) => (
        <TV
          width={getBoardSize({ screenWidth, screenHeight })}
          streamConfig={{
            on: true,
            stream,
            type: 'audio-video',
          }}
        />
      )}
    />
  );
});

export const withFallback = () => React.createElement(() => {
  const [screenWidth, screenHeight] = useWindowSize();

  return (
    <WithLocalStream
      render={() => (
        <TV
          width={getBoardSize({ screenWidth, screenHeight })}
          streamConfig={{ on: false }}
        />
      )}
    />
  );
});

export const both = () => React.createElement(() => {
  const [screenWidth, screenHeight] = useWindowSize();

  return (
    <WithLocalStream
      render={(stream) => (
        <>
          <TV
            width={getBoardSize({ screenWidth, screenHeight })}
            streamConfig={{
              on: true,
              stream,
              type: 'audio-video',
            }}
          />
          <TV
            width={getBoardSize({ screenWidth, screenHeight })}
            streamConfig={{ on: false }}
            fallbackComponent={(
              <Mutunachi
                mid={2}
                style={{
                  width: '100%',
                }}
              />
            )}
          />
        </>
      )}
    />
  );
});
