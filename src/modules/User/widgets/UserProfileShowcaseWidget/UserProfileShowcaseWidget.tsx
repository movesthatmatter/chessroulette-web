import { GuestUserRecord, RegisteredUserRecord, Resources } from 'chessroulette-io';
import React, { useEffect, useState } from 'react';
import { useAnyUser } from 'src/services/Authentication';
import { UserProfileShowcase } from './components/UserProfileShowcase';
import { UserState, PlayerStats } from './types';
import { getMyPlayerStats } from 'src/modules/Landing/LandingPage/resources';
import { LoaderPlaceholder } from 'src/components/LoaderPlaceholder/LoaderPlaceholder';

type Props = {
  className?: string;
  callToActionComponent?: (user: UserState) => React.ReactNode;
};

export const UserProfileShowcaseWidget: React.FC<Props> = (props) => {
  const user = useAnyUser();
  const [state, setState] = useState<
    | {
        isGuest: true;
        user: GuestUserRecord;
      }
    | {
        isGuest: false;
        user: RegisteredUserRecord;
        stats: PlayerStats;
      }
  >();

  useEffect(() => {
    if (!user) {
      return setState(undefined);
    }

    if (user.isGuest) {
      return setState({
        user,
        isGuest: true,
      });
    }

    getMyPlayerStats().map((stats) => {
      setState({
        user,
        isGuest: false,
        stats,
      });
    });
  }, [user?.id]);

  if (!state) {
    return <LoaderPlaceholder/>
  }

  return <UserProfileShowcase {...state} {...props} />;
};
