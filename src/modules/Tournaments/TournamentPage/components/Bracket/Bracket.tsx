import React, { useEffect, useMemo, useState } from 'react';
import { TournamentWithFullDetailsRecord } from 'chessroulette-io/dist/resourceCollections/tournaments/records';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { range } from 'src/lib/util';
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

	const rounds = useMemo(
		() =>
			range(
				tournament.matches
					.map((p) => p.round)
					.reduce((prev, next) => (next > prev ? next : prev), 0)
			),
		[tournament.matches.length]
	);

	return (
		<div className={cls.container}>
			{rounds.map((_, i) => (
				<div key={`round-${i}`} className={cls.roundContainer}>
					<div>
						<Text size="smallItalic">{`Round ${i + 1}`}</Text>
					</div>
					<div className={cls.round}>
						{matchesByRound[i + 1] &&
							matchesByRound[i + 1].length > 0 &&
							matchesByRound[i + 1].map((match) => <MatchViewer key={match.id} match={match} />)}
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
		paddingTop: spacers.default,
		paddingBottom: spacers.default,
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
		gap: spacers.largest,
	},
});
