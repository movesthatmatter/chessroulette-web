import React from 'react';
import { useParams } from 'react-router-dom';
import { RoomPage } from './RoomPage';

type Props = {};

export const RoomRoute: React.FC<Props> = () => {
  const params = useParams<{ slug: string }>();

  return <RoomPage slug={params.slug} />;
};
