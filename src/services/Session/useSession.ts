import { useSelector } from 'react-redux';
import { selectSession } from './selector';

export const useSession = () => useSelector(selectSession);
