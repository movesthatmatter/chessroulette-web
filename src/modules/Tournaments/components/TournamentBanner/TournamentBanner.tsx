import React, { useEffect, useState } from 'react';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import dateformat from 'dateformat';
import { Button } from 'src/components/Button';
import { AuthenticationBouncer } from 'src/services/Authentication/widgets';
import { createTournamentParticipant } from '../../resources';
import { useAuthentication } from 'src/services/Authentication';
import { TournamentWithFullDetailsRecord } from 'chessroulette-io/dist/resourceCollections/tournaments/records';

type Props = {
	tournament: TournamentWithFullDetailsRecord;
};

export const TournamentBanner: React.FC<Props> = ({ tournament }) => {
	const cls = useStyles();
	const auth = useAuthentication();
	const [iAmParticipating, setIAmParticipating] = useState<boolean>(false);

	useEffect(() => {
		if (auth.authenticationType !== 'user') {
			return;
		}
		setIAmParticipating(!!tournament.participants.find((p) => p.user.id === auth.user.id));
		//setIAmParticipating(true);
	}, [auth]);

	return (
		<div className={cls.container}>
			<div className={cls.topRow}>
				<div className={cls.title}>
					<Text size="titleItalic">
						{tournament.name.charAt(0).toUpperCase() + tournament.name.slice(1)}
					</Text>
				</div>
				<div className={cls.date}>
					<Text size="smallItalic">
						{tournament.startAt && `${dateformat(tournament.startAt, 'dd-mm-yyyy')}`}
					</Text>
				</div>
				<div>
					<AuthenticationBouncer
						onAuthenticated={({ user }) => {
							createTournamentParticipant({
								tournamentId: tournament.id,
							}).map(() => setIAmParticipating(true));
						}}
						render={({ check }) => (
							<Button
								label={
									iAmParticipating
										? 'You are Participanting'
										: tournament.state === 'pending'
										? 'Join'
										: 'Registration Closed'
								}
								disabled={iAmParticipating || tournament.state !== 'pending'}
								type="primary"
								style={{ marginBottom: '0px' }}
								onClick={check}
							/>
						)}
					/>
				</div>
			</div>
		</div>
	);
};

const useStyles = createUseStyles((theme) => ({
	container: {
		display: 'flex',
		flexDirection: 'column',
		minWidth: '50%',
		maxWidth: '90%',
		backgroundColor: theme.colors.neutralLight,
		padding: spacers.default,
	},
	topRow: {
		display: 'flex',
		gap: spacers.largest,
		justifyContent: 'space-between',
	},
	title: {
		alignSelf: 'center',
		flex: 1,
	},
	date: {
		alignSelf: 'center',
	},
}));
