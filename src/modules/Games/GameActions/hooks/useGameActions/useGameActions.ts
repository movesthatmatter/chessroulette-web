import { useContext } from 'react';
import { GameProviderContext } from 'src/modules/Games/Providers/GameProvider/GameProviderContext';

export const useGameActions = () => useContext(GameProviderContext).gameActions;
