import React from 'react';
import { useParams } from 'react-router-dom';
import { GameRoomContainer } from './GameRoomContainer';

type Props = {};

export const GameRoomPage: React.FC<Props> = () => {
  const params = useParams<{id: string; code?: string}>();

  return (
    <GameRoomContainer
      id={params.id}
      code={params.code}
    />
  );
};
