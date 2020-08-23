/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react';
import { Grommet } from 'grommet';
import { WithLocalStream } from 'src/storybook/WithLocalStream';
import { defaultTheme } from 'src/theme';
import { PeerMocker } from 'src/mocks/records/PeerMocker';
import { reduceChessGame, ChessGameState, ChessGameColor } from 'src/modules/Games/Chess';
import { Page } from 'src/components/Page/Page';
import { GameRoomV2 } from './GameRoomV2';
import { otherChessColor } from '../Games/Chess/util';

export default {
  component: GameRoomV2,
  title: 'modules/GameRoomV2/GameRoomV2',
};

const peerMock = new PeerMocker();

export const defaultStory = () => (
  <Grommet theme={defaultTheme} full>
    <WithLocalStream render={(stream) => React.createElement(() => {
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

      const [currentGame] = useState<ChessGameState>(reduceChessGame.prepareGame({
        playersBySide: {
          away: opponent,
          home: me,
        },
        homeColor: 'white',
        timeLimit: 'blitz',
      }));

      return (
        <GameRoomV2
          me={me}
          opponent={opponent}
          game={currentGame}
          onGameStateUpdate={() => currentGame}
        />
      );
    })}
    />
  </Grommet>
);

export const asPage = () => (
  <Grommet theme={defaultTheme} full>
    <WithLocalStream render={(stream) => React.createElement(() => {
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

      const [currentGame, setCurrentGame] = useState<ChessGameState>(reduceChessGame.prepareGame({
        playersBySide: {
          away: opponent,
          home: me,
        },
        homeColor: 'white',
        timeLimit: 'bullet',
      }));

      return (
        <Page>
          <GameRoomV2
            me={me}
            opponent={opponent}
            game={currentGame}
            onGameStateUpdate={setCurrentGame}
          />
        </Page>
      );
    })}
    />
  </Grommet>
);

export const asPageWithSwitchingSides = () => (
  <Grommet theme={defaultTheme} full>
    <WithLocalStream render={(stream) => React.createElement(() => {
      const [playersBySide, setPlayersBySide] = useState({
        home: peerMock.withChannels({
          streaming: {
            on: true,
            type: 'audio-video',
            stream,
          },
        }),
        away: peerMock.withChannels({
          streaming: {
            on: true,
            type: 'audio-video',
            stream,
          },
        }),
      });

      const [currentGame, setCurrentGame] = useState<ChessGameState>(reduceChessGame.prepareGame({
        playersBySide,
        homeColor: 'white',
        timeLimit: 'bullet',
      }));

      // useEffect(() => {
      //   setCu
      // }, [homeColor]);

      return (
        <Page>
          <GameRoomV2
            me={playersBySide.home}
            opponent={playersBySide.away}
            game={currentGame}
            // onGameStateUpdate={setCurrentGame}
            onGameStateUpdate={(nextGame) => {
              setPlayersBySide((prev) => ({
                home: prev.away,
                away: prev.home,
              }));

              setCurrentGame(nextGame);
            }}
          />
        </Page>
      );
    })}
    />
  </Grommet>
);

export const asPageWithFinishedGame = () => (
  <Grommet theme={defaultTheme} full>
    <WithLocalStream render={(stream) => React.createElement(() => {
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

      const [currentGame, setCurrentGame] = useState<ChessGameState>(reduceChessGame.prepareGame({
        playersBySide: {
          away: opponent,
          home: me,
        },
        homeColor: 'white',
        timeLimit: 'bullet',
        pgn: '1. e4 e5 2. Qf3 Na6 3. Bc4 h6 4. Qxf7#',
      }));

      return (
        <Page>
          <GameRoomV2
            me={me}
            opponent={opponent}
            game={currentGame}
            onGameStateUpdate={setCurrentGame}
          />
        </Page>
      );
    })}
    />
  </Grommet>
);
