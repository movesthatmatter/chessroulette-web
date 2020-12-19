/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Chessboard } from './ChessBoardV2';


export default {
  component: Chessboard,
  title: 'modules/Games/Chess/Components/ChessBoardV2',
};

export const defaultStory = () => (
  <Chessboard size={431}/>
)