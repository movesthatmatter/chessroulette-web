import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import { TournamentWithFullDetailsMocker } from '../mocks/TournamentWithFullDetailsMocker';
import { TournamentWithFullDetailsRecord } from '../types';
import { MatchViewer } from '../components/MatchViewer/MatchViewer';

type Props = {
	tournament?: TournamentWithFullDetailsRecord;
};

const tournamentMocker = new TournamentWithFullDetailsMocker();

export const TournamentPage: React.FC<Props> = (props) => {
	const cls = useStyles();
	const [tournament, setTournament] = useState(tournamentMocker.record('pending', 4));

	useEffect(() => {
		console.log('tournament ', tournament);
	}, [tournament]);

	return (
		<div className={cls.container}>
			{tournament && tournament.matches.map((match) => <MatchViewer match={match} />)}
		</div>
	);
};

const useStyles = createUseStyles({
	container: {
		display: 'flex',
		flexDirection: 'column',
		gap: spacers.default,
	},
});
