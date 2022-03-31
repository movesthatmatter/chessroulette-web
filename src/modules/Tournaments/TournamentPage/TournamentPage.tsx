import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import { TournamentWithFullDetailsMocker } from '../mocks/TournamentWithFullDetailsMocker';
import { TournamentWithFullDetailsRecord } from '../types';
import { MatchViewer } from '../components/MatchViewer/MatchViewer';
import { indexMatchesByRound } from '../utils';
import { Text } from 'src/components/Text';

type Props = {
	tournament: TournamentWithFullDetailsRecord;
};

const tournamentMocker = new TournamentWithFullDetailsMocker();

export const TournamentPage: React.FC<Props> = ({ tournament }) => {
	const cls = useStyles();
	const [matchesByRound, setMatchesByRound] = useState(
		indexMatchesByRound(tournament.matches, tournament.swissRounds)
	);

	useEffect(() => {
		console.log('matches by round', matchesByRound);
	}, [matchesByRound]);

	useEffect(() => {
		setMatchesByRound(indexMatchesByRound(tournament.matches, tournament.swissRounds));
	}, [tournament]);

	return (
		<div className={cls.container}>
			{new Array(tournament.swissRounds).fill(null).map((_, i) => (
				<div className={cls.roundContainer}>
					<div>
						<Text size="smallItalic">{`Round ${i + 1}`}</Text>
					</div>
					<div className={cls.round}>
						{matchesByRound[i + 1] &&
							matchesByRound[i + 1].length > 0 &&
							matchesByRound[i + 1].map((match) => <MatchViewer match={match} />)}
					</div>
				</div>
			))}
		</div>
	);
};

const useStyles = createUseStyles({
	container: {
		display: 'flex',
		flexDirection: 'column',
		gap: spacers.default,
		padding: spacers.default,
	},
	roundContainer: {
		display: 'flex',
		flexDirection: 'column',
		gap: spacers.default,
		marginBottom: spacers.large,
	},
	round: {
		display: 'flex',
		flexWrap: 'wrap',
		width: '100%',
		gap: spacers.large,
	},
});
