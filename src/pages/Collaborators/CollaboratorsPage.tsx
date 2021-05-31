import React from 'react';
import { Page } from 'src/components/Page';
import { createUseStyles } from 'src/lib/jss';

type Props = {};

export const CollaboratorsPage: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <Page name="Collaborators">
      
    </Page>
  );
};

const useStyles = createUseStyles({
  container: {},
});