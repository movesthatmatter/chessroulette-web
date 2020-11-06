import React from 'react';
import { Stats } from './Stats';
import { createUseStyles } from 'src/lib/jss';
import { Page } from 'src/components/Page';
import { StatsContainer } from './StatsContainer';

type Props = {};

export const StatsPage: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <Page>
      <StatsContainer />
    </Page>
  );
};

const useStyles = createUseStyles({
  container: {},
});