import React, { useEffect, useState } from 'react';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { TournamentWithFullDetailsRecord } from '../types';
import { Tabs } from 'src/components/Tabs';
import { Bracket } from './components/Bracket/Bracket';
import { Players } from './components/Players/Players';
import { spacers } from 'src/theme/spacers';
import { TournamentBanner } from '../components/TournamentBanner/TournamentBanner';
import { Game, Filter } from 'react-iconly';
import { Page } from 'src/components/Page';
import DiscordReactEmbed from '@widgetbot/react-embed';
import config from 'src/config';
import { hardBorderRadius } from 'src/theme';

type Props = {
  tournament: TournamentWithFullDetailsRecord;
};

export const TournamentPage: React.FC<Props> = ({ tournament }) => {
  const cls = useStyles();
  const [tab, setTab] = useState(
    tournament.state === 'pending' ||
      tournament.state === 'complete' ||
      tournament.state === 'ended'
      ? 1
      : 0
  );

  return (
    <Page name="Tournament" stretched>
      <div className={cls.container}>
        <div className={cls.main}>
          <TournamentBanner tournament={tournament} />
          {
            <div className={cls.tournamentDetails}>
              <div>
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
            </div>
          }
        </div>
        <div className={cls.side}>
          {/* <div
            style={{
              minHeight: '30rem',
              maxHeight: '40rem',
              width: '100%',
            }}
          > */}
          <DiscordReactEmbed
            server={config.DISCORD_SERVER_ID}
            channel={config.DISCORD_CHANNEL_ID_TOURNAMENTS}
            className={cls.discordWidget}
          />
        </div>
        {/* </div> */}
      </div>
    </Page>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    display: 'flex',
    // flexDirection: 'column',
    gap: spacers.large,
    // background: 'red',
    height: '100%',
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
  tournamentDetails: {
    display: 'flex',
    gap: spacers.largest,
    // justifyContent: 'space-between',
  },
  discordWidget: {
    flex: 1,
    width: '100%',
    height: '100%',
    ...makeImportant({
      background: theme.depthBackground.backgroundColor,
      ...hardBorderRadius,
      overflow: 'hidden',
    }),
  },

  main: {
    flex: 1,
  },
  side: {
    display: 'flex',
    maxWidth: '30rem',
    // width: '20%',
    height: 'calc(100vh - 140px)',
    // position: 'fixed',
    right: 0,
    // background: 'red',
  },
}));
