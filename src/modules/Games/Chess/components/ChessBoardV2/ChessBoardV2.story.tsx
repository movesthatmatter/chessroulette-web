/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { ChessBoard } from './ChessBoardV2';


export default {
  component: ChessBoard,
  title: 'modules/Games/Chess/Components/ChessBoardV2',
};

export const defaultStory = () => (
  <ChessBoard size={431}/>
);
