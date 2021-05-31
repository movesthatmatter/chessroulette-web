/* eslint-disable import/no-extraneous-dependencies */
import { action } from '@storybook/addon-actions';
import React, { useState } from 'react';
import { Button } from 'src/components/Button';
import { StyledChessBoard } from './StyledChessBoard';

export default {
  component: StyledChessBoard,
  title: 'modules/Games/Chess/Components/StyledChessBoard',
};

export const defaultStory = () => <StyledChessBoard size={431} onMove={action('on move')} />;

export const notPlayable = () =>
  React.createElement(() => {
    const [viewOnly, setViewOnly] = useState(false);
    return (
      <>
        <StyledChessBoard size={421} viewOnly={viewOnly} onMove={action('on move')}/>
        <Button onClick={() => setViewOnly((prev) => !prev)} label="View only" />
      </>
    );
  });
