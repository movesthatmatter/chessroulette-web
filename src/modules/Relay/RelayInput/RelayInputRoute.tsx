import React from 'react';
import { useParams } from 'react-router-dom';
import { Text } from 'src/components/Text';
import { GameProvider } from 'src/modules/Games/Providers/GameProvider/GameProvider';
import { RelayInputPage } from './RelayInputPage';

type Props = {};

export const RelayInputRoute: React.FC<Props> = () => {
  const params = useParams<{ slug: string }>();

  return (
    <GameProvider>
      <RelayInputPage />
    </GameProvider>
  );
};
