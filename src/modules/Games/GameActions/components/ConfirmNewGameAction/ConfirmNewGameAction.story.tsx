
import { action } from '@storybook/addon-actions';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Button } from 'src/components/Button';
import { GameMocker } from 'src/mocks/records';
import { ConfirmNewGameAction } from './ConfirmNewGameAction';

export default {
  component: ConfirmNewGameAction,
  title: 'modules/PlayRoom/widgets/ConfirmNewGameAction',
};

const gameMocker = new GameMocker();

const prevGame = gameMocker.withProps({
  state: 'finished',
  timeLimit: 'rapid20',
});

export const defaultStory = () => (
  <>
    <ConfirmNewGameAction
      title="Rematch"
      content={`Challenge ${prevGame.players[1].user.name}`}
      prevGameSpecs={{
        timeLimit: 'bullet30',
        preferredColor: 'white',
      }}
      submitButton={({ isRematchable}) => (isRematchable ? ({
        label: 'Rematch',
        type: 'positive',
      }) : ({
        label: 'Create',
        type: 'primary',
      }))}
      onSubmit={action('on submit')}
      render={(p) => <Button onClick={p.onConfirm} label="Rematch" />}
    />
    <ConfirmNewGameAction
      title="New Game"
      content={`Challenge ${prevGame.players[1].user.name}`}
      submitButton={{
        label: 'Create',
        type: 'primary',
      }}
      onSubmit={action('on submit')}
      render={(p) => <Button onClick={p.onConfirm} label="New Game" />}
    />
  </>
);
