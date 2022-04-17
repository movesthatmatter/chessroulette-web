import { useHistory } from 'react-router-dom';

export type ExitRoomProps =
  | { exitBy: 'goBack' | 'goHome' }
  | { exitBy: 'goToRoute'; goToRouteName: string };

export const useExitRoom = () => {
  const history = useHistory();

  return (p: ExitRoomProps = { exitBy: 'goBack' }) => {
    if (p.exitBy === 'goBack') {
      if (history.length > 1) {
        history.goBack();
      } else {
        history.replace('/');
      }
    } else if (p.exitBy === 'goHome') {
      history.push('/');
    } else if (p.exitBy === 'goToRoute') {
      history.push(p.goToRouteName);
    }
  };
};
