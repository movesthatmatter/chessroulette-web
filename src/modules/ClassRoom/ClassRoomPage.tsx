import React from 'react';
import { useParams } from 'react-router-dom';
import { ClassRoomContainer } from './ClassRoomContainer';

type Props = {};

export const ClassRoomPage: React.FC<Props> = () => {
  const params = useParams<{id: string; code?: string}>();

  return (
    <ClassRoomContainer roomCredentials={params} />
  );
};
