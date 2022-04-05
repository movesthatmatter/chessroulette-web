import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { TournamentWithFullDetailsRecord } from '../types';
import { Tabs } from 'src/components/Tabs';
import { Bracket } from './components/Bracket/Bracket';
import { Players } from './components/Players/Players';
import { spacers } from 'src/theme/spacers';
import { TournamentBanner } from '../components/TournamentBanner/TournamentBanner';
import { useAuthentication } from 'src/services/Authentication';

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
		<div className={cls.container}>
			<TournamentBanner tournament={tournament} />
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
		</div>
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
		borderBottom: `2px solid ${theme.colors.primary}`,
	},
}));
