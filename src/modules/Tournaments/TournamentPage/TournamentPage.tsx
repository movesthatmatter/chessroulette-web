import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { TournamentWithFullDetailsRecord } from '../types';
import { Tabs } from 'src/components/Tabs';
import { Bracket } from './components/Bracket/Bracket';
import { Players } from './components/Players/Players';
import { spacers } from 'src/theme/spacers';

type Props = {
	tournament: TournamentWithFullDetailsRecord;
};

export const TournamentPage: React.FC<Props> = ({ tournament }) => {
	const cls = useStyles();

	const [tab, setTab] = useState(0);

	useEffect(() => {
		console.log('tournament in page : ', tournament);
	}, [tournament]);

	return (
		<Tabs
			currentTabIndex={tab}
			onTabChanged={setTab}
			headerClassName={cls.headerClass}
			tabButtonClassName={cls.tabButton}
			selectedTabButtonClassName={cls.selectedTab}
			tabs={[
				{
					title: 'Matches',
					content: <Bracket tournament={tournament} />,
				},
				{
					title: 'Players Standings',
					content: <Players tournament={tournament} />,
				},
			]}
		/>
	);
};

const useStyles = createUseStyles((theme) => ({
	headerClass: {
		borderBottom: '0px',
	},
	tabButton: {
		paddingBottom: spacers.smallest,
		marginRight: spacers.largest,
	},
	selectedTab: {
		borderBottom: `2px solid ${theme.colors.primary}`,
	},
}));
