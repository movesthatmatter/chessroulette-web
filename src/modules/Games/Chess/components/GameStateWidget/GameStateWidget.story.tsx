import { action } from '@storybook/addon-actions';
import { toISODateTime } from 'io-ts-isodatetime';
import React from 'react';
import { minutes, seconds } from 'src/lib/time';
import { GameMocker } from 'src/mocks/records';
import { RoomPlayActivityParticipantMocker } from 'src/mocks/records/RoomPlayActivityParticipant';
import { roomPlayActivityParticipantToChessPlayer } from 'src/modules/Room/RoomActivity/activities/PlayActivity';
import { StorybookBaseProvider } from 'src/storybook/StorybookBaseProvider';
import { GameStateWidget } from './GameStateWidget';

export default {
  component: GameStateWidget,
  title: 'modules/Games/Chess/components/GameStateWidget',
};

const gameMocker = new GameMocker();

const playParticipantMoker = new RoomPlayActivityParticipantMocker();
const blackParticipant = playParticipantMoker.withProps({ color: 'black' });
const whiteParticipant = playParticipantMoker.withProps({ color: 'white' });

export const defaultStory = () => {
  const game = gameMocker.withProps({
    state: 'pending',
    timeLimit: 'blitz5',
    players: [
      roomPlayActivityParticipantToChessPlayer(blackParticipant),
      roomPlayActivityParticipantToChessPlayer(whiteParticipant),
    ],
    timeLeft: {
      white: minutes(5),
      black: minutes(5),
    },
    pgn: undefined,
    winner: undefined,
    lastMoveBy: undefined,
    lastMoveAt: undefined,
  });

  return (
    <StorybookBaseProvider withRedux>
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
          game={game}
          homeColor="black"
          playParticipants={
            {
              white: whiteParticipant,
              black: blackParticipant,
            } as const
          }
          onTimerFinished={action('onTimerFinished')}
        />
      </div>
    </StorybookBaseProvider>
  );
};

export const withTimeFinished = () => (
  <StorybookBaseProvider withRedux>
    <div
      style={{
        width: '300px',
        height: '500px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          flex: 1,
        }}
      />
      <div
        style={{
          flex: 0.2,
        }}
      >
        <div
          style={{
            height: '300px',
          }}
        >
          <GameStateWidget
            homeColor="black"
            playParticipants={{
              black: blackParticipant,
              white: whiteParticipant,
            }}
            game={gameMocker.withProps({
              state: 'stopped',
              timeLimit: 'blitz5',
              players: [
                {
                  color: 'white',
                  user: roomPlayActivityParticipantToChessPlayer(whiteParticipant).user,
                },
                {
                  color: 'black',
                  user: roomPlayActivityParticipantToChessPlayer(blackParticipant).user,
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
            })}
            onTimerFinished={action('onTimerFinished')}
          />
        </div>
      </div>
      <div
        style={{
          flex: 1,
        }}
      />
    </div>
  </StorybookBaseProvider>
);

export const withGameStarted = () => (
  <StorybookBaseProvider withRedux>
    <div
      style={{
        width: '300px',
      }}
    >
      <GameStateWidget
        homeColor="black"
        playParticipants={{
          black: blackParticipant,
          white: whiteParticipant,
        }}
        game={gameMocker.withProps({
          state: 'started',
          timeLimit: 'blitz5',
          players: [
            {
              color: 'white',
              user: roomPlayActivityParticipantToChessPlayer(whiteParticipant).user,
            },
            {
              color: 'black',
              user: roomPlayActivityParticipantToChessPlayer(blackParticipant).user,
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
        })}
        onTimerFinished={action('onTimerFinished')}
      />
    </div>
  </StorybookBaseProvider>
);
