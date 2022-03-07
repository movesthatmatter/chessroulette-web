import { useContext } from 'react';
import { WarGameProviderContext } from 'src/modules/Games/WarGame/WarGameProvider/WarGameProviderContext';

export const useGameActions = () => useContext(WarGameProviderContext).warGameActions;
