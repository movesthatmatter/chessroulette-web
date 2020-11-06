/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { action } from '@storybook/addon-actions';
import { ChessBoard } from './ChessBoard';

export default {
  component: ChessBoard,
  title: 'Modules/Games/Chess/components/Chess Board',
};

export const defaultStory = () => <ChessBoard history={[]} clickedSquareStyle={{}} />;

export const styled = () => <ChessBoard 
  history={[]}
  clickedSquareStyle={{}}
  darkSquareStyle={{
    backgroundColor: '#7D9AC7',
  }}
  lightSquareStyle={{
    backgroundColor: '#DEE5F0',
  }}
/>;
