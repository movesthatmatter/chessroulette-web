/* eslint-disable import/no-extraneous-dependencies */
import { Grommet } from 'grommet';
import { toISODateTime } from 'io-ts-isodatetime';
import React from 'react';
import { minutes, seconds } from 'src/lib/time';
import { UserRecordMocker } from 'src/mocks/records';
import { defaultTheme } from 'src/theme';
import { GameStateWidget } from './GameStateWidget';

export default {
  component: GameStateWidget,
  title: 'modules/Games/Chess/components/GameStateWidget',
};

const userMocker = new UserRecordMocker();
const playerA = userMocker.record();
const playerB = userMocker.record();

export const defaultStory = () => (
  <Grommet theme={defaultTheme}>
    <div
      style={{
        width: '300px',
        height: '200px',
        // background: 'grey',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <GameStateWidget
        homeColor="black"
        game={{
          state: 'pending',
          timeLimit: 'blitz',
          players: [
            {
              color: 'white',
              user: playerA,
            },
            {
              color: 'black',
              user: playerB,
            },
          ],
          timeLeft: {
            white: minutes(5),
            black: minutes(5),
          },
          pgn: undefined,
          winner: undefined,
          lastMoveBy: undefined,
          lastMoveAt: undefined,
          lastMoved: undefined,
          captured: undefined,
        }}
      />
    </div>
  </Grommet>
);

export const withTimeFinished = () => (
  <Grommet theme={defaultTheme}>
    <div
      style={{
        width: '300px',
        height: '500px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{
        flex: 1,
      }}/>
      <div style={{
        flex: .2,
      }}>
        <div style={{
          height: '300px',
        }}>
        <GameStateWidget
          homeColor="black"
          game={{
            state: 'stopped',
            timeLimit: 'blitz',
            players: [
              {
                color: 'white',
                user: playerA,
              },
              {
                color: 'black',
                user: playerB,
              },
            ],
            timeLeft: {
              white: seconds(5),
              black: 0,
            },
            pgn: '1. e4 c5 2. Nf3 d6 3. Bb5+ Nc6 4. O-O Bd7 5. Re1 Nf6 6. c3 a6 7. Ba4 b5 8. Bc2',
            winner: 'white',
            lastMoveBy: 'black',
            lastMoveAt: toISODateTime(new Date()),
            lastMoved: 'white',
            captured: {
              white: {
                p: 0,
                n: 0,
                q: 0,
                r: 0,
                b: 0,
              },
              black: {
                p: 0,
                n: 0,
                q: 0,
                r: 0,
                b: 0,
              },
            },
          }}
        />
        </div>
      </div>
      <div style={{
        flex: 1,
      }}/>
    </div>
  </Grommet>
);

export const withGameStarted = () => (
  <Grommet theme={defaultTheme}>
    <div
      style={{
        width: '300px',
      }}
    >
      <GameStateWidget
        homeColor="black"
        game={{
          state: 'started',
          timeLimit: 'blitz',
          players: [
            {
              color: 'white',
              user: playerA,
            },
            {
              color: 'black',
              user: playerB,
            },
          ],
          timeLeft: {
            white: seconds(5),
            black: seconds(15),
          },
          pgn: '1. e4',
          winner: undefined,
          lastMoveBy: 'white',
          lastMoveAt: toISODateTime(new Date()),
          lastMoved: 'white',
          captured: {
            white: {
              p: 0,
              n: 0,
              q: 0,
              r: 0,
              b: 0,
            },
            black: {
              p: 0,
              n: 0,
              q: 0,
              r: 0,
              b: 0,
            },
          },
        }}
      />
    </div>
  </Grommet>
);
