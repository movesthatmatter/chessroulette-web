import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Room, Peer } from 'src/components/RoomProvider';
import { List, Heading, Header } from 'grommet';

type Props = {
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
        data={props.peers.map((p) => p.name)}
        className={props.className}
      />
    </>
  );
};

const useStyles = createUseStyles({
  container: {},
});
