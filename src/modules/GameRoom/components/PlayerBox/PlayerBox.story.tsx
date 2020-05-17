/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { ChessPlayerMock } from 'src/mocks/records';
import { WithLocalStream } from 'src/storybook/WithLocalStream';
import { action } from '@storybook/addon-actions';
import { PlayerBox } from './PlayerBox';


export default {
  component: PlayerBox,
  title: 'Modules/GameRoom/Components/PlayerBox',
};

const chessPlayerMock = new ChessPlayerMock();

const whitePlayerMock = chessPlayerMock.white;

export const homePlayer = () => (
  <div style={{
    width: '500px',
  }}
  >
    <WithLocalStream render={(stream) => (
      <PlayerBox
        player={whitePlayerMock}
        side="home"
        streamConfig={{
          on: true,
          stream,
          type: 'audio-video',
        }}
        currentGame={undefined}
        avatarId="8"
        onTimeFinished={action('on time finished')}
      />
    )}
    />
  </div>
);
