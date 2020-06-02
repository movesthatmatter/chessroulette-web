import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Room, Peer } from 'src/components/RoomProvider';
import { List, Heading, Header } from 'grommet';

type Props = {
  me: Peer;
  peers: Peer[];
  className?: string;
};

export const MemberList: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <>
      <Header background="light-2" pad="small">
        Members
      </Header>
      <List
        data={[props.me, ...props.peers].map((p) => (p.id === props.me.id ? `${p.name} (Me)` : p.name))}
        className={props.className}
      />
    </>
  );
};

const useStyles = createUseStyles({
  container: {},
});
