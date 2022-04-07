import { TournamentMatchRecord } from 'chessroulette-io/dist/resourceCollections/tournaments/records';
import React from 'react';
import { Page } from 'src/components/Page';
import { createUseStyles } from 'src/lib/jss';

type Props = {
	match: TournamentMatchRecord;
};

export const MatchPage: React.FC<Props> = ({ match }) => {
	const cls = useStyles();

	return (
		<Page name="match" stretched>
			<div className={cls.container}>{match.id}</div>
		</Page>
	);
};

const useStyles = createUseStyles({
	container: {},
});
