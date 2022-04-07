import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { TournamentWithFullDetailsRecord } from '../types';
import { Tabs } from 'src/components/Tabs';
import { Bracket } from './components/Bracket/Bracket';
import { Players } from './components/Players/Players';
import { spacers } from 'src/theme/spacers';
import { TournamentBanner } from '../components/TournamentBanner/TournamentBanner';
import { Game, Filter } from 'react-iconly';
import { Page } from 'src/components/Page';

type Props = {
  tournament: TournamentWithFullDetailsRecord;
};

export const TournamentPage: React.FC<Props> = ({ tournament }) => {
  const cls = useStyles();
  const [tab, setTab] = useState(0);

  return (
    <Page name="Tournament">
      <div className={cls.container}>
        <TournamentBanner tournament={tournament} />
        <Tabs
          currentTabIndex={tab}
          onTabChanged={setTab}
          headerClassName={cls.headerClass}
          tabButtonClassName={cls.tabButton}
          selectedTabButtonClassName={cls.selectedTab}
          selectedColor="#FF32A1"
          tabs={[
            {
              title: 'Matches',
              content: <Bracket tournament={tournament} />,
              iconType: 'iconly',
              icon: Game,
              iconSize: 'default',
            },
            {
              title: 'Players Standings',
              content: <Players tournament={tournament} />,
              iconType: 'iconly',
              icon: Filter,
              iconSize: 'default',
            },
          ]}
        />
      </div>
    </Page>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacers.default,
  },
  headerClass: {
    borderBottom: '0px',
  },
  tabButton: {
    paddingBottom: spacers.smallest,
    marginRight: spacers.largest,
  },
  selectedTab: {
    //borderBottom: `2px solid ${theme.colors.primary}`,
  },
}));
