import { Box } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { Button } from 'src/components/Button';
import { PlayerPendingOverlay } from 'src/components/PlayerPendingOverlay/PlayerPendingOverlay';
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

export const withPendingOverlay = () =>
  React.createElement(() => {
    const [target, setTarget] = useState<ReactElement | null>(null);
    const chessRef = useRef();
    const [open, setOpen] = useState(false);

    /* useEffect(() => {
      if (chessRef && chessRef.current){
        console.log('ref updating', chessRef.current);
        setTarget(chessRef.current);
      }
    },[]) */
    return (
      <div style={{display: 'flex', flexDirection:'column'}}>
        <Box ref={chessRef as any} fill style={{width:'fit-content'}}>
        <ChessBoard size={421} key={new Date().getTime()}/>
        </Box>
        <Button label='Open' onClick={() => setOpen(true)}/>
        {open && <PlayerPendingOverlay target={chessRef.current}/>}
      </div>
    );
  });
