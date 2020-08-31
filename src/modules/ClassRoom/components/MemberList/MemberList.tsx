import React from 'react';
import { Peer } from 'src/components/RoomProvider';
import { List, Header } from 'grommet';

type Props = {
  me: Peer;
  peers: Peer[];
  className?: string;
};

export const MemberList: React.FC<Props> = (props) => (
  <>
    <Header background="light-2" pad="small">
      Members
    </Header>
    <List
      data={
        [props.me, ...props.peers].map((p) =>
          (p.id === props.me.id
            ? `${p.user.name} (Me)`
            : p.user.name))
      }
      className={props.className}
    />
  </>
);
