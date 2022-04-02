import { TournamentWithFullDetailsRecord } from 'chessroulette-io/dist/resourceCollections/tournaments/records';
import React, { useEffect, useState } from 'react';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { MatchViewer } from 'src/modules/Tournaments/components/MatchViewer/MatchViewer';
import { indexMatchesByRound } from 'src/modules/Tournaments/utils';
import { spacers } from 'src/theme/spacers';

type Props = {
	tournament: TournamentWithFullDetailsRecord;
};

export const Bracket: React.FC<Props> = ({ tournament }) => {
	const [matchesByRound, setMatchesByRound] = useState(
		indexMatchesByRound(tournament.matches, tournament.swissRounds)
	);

	useEffect(() => {
		setMatchesByRound(indexMatchesByRound(tournament.matches, tournament.swissRounds));
	}, [tournament]);

	const cls = useStyles();

	useEffect(() => {
		console.log('tournament in bracket : ', tournament);
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
