import React from 'react';
import { useParams } from 'react-router-dom';
import { Text } from 'src/components/Text';
import { RelayInputPage } from './RelayInputPage';

type Props = {};

export const RelayInputRoute: React.FC<Props> = () => {
  const params = useParams<{ slug: string }>();

  return (
    <RelayInputPage />
  );
};
