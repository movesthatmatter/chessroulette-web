import React, { useContext } from 'react';
import { RoomProviderContext, RoomProviderContextState } from '../RoomProvider';

type Props = {
  render: (props: NonNullable<RoomProviderContextState>) => React.ReactNode;
};

export const ProvidedRoom: React.FC<Props> = (props) => {
  const context = useContext(RoomProviderContext);

  if (!context) {
    return null;
  }

  return <>{props.render(context)}</>;
};
