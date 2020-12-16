import { useSelector } from 'react-redux';
import { selectAuthentication } from './selectors';

export const useAuthentication = () => useSelector(selectAuthentication);

export const useAuthenticatedUser = () => {
  const auth = useSelector(selectAuthentication);

  return auth.authenticationType !== 'none' ? auth.user : undefined;
};
