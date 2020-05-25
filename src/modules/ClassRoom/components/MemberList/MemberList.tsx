import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Room, Peer } from 'src/components/RoomProvider';
import { List, Heading } from 'grommet';

type Props = {
  peers: Peer[];
};

export const MemberList: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <List data={props.peers.map((p) => p.name)} />
  );
};

const useStyles = createUseStyles({
  container: {},
});
