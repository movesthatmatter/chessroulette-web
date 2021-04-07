/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { Button } from 'src/components/Button';
import { ChessBoard } from './ChessBoardV2';

export default {
  component: ChessBoard,
  title: 'modules/Games/Chess/Components/ChessBoardV2',
};

export const defaultStory = () => <ChessBoard size={431} />;

export const notPlayable = () =>
  React.createElement(() => {
    const [viewOnly, setViewOnly] = useState(false);
    return (
      <>
        <ChessBoard size={421} viewOnly={viewOnly} />
        <Button onClick={() => setViewOnly((prev) => !prev)} label="View only" />
      </>
    );
  });
