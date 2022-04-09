import React, { useEffect, useState } from 'react';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import dateformat from 'dateformat';
import { Button } from 'src/components/Button';
import { AuthenticationBouncer } from 'src/services/Authentication/widgets';
import { createTournamentParticipant } from '../../resources';
import { useAuthentication } from 'src/services/Authentication';
import {
	TournamentRecord,
	TournamentWithFullDetailsRecord,
} from 'chessroulette-io/dist/resourceCollections/tournaments/records';
import { floatingShadow, onlyMobile, softBorderRadius } from 'src/theme';
import { People } from 'react-iconly';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { colors } from 'src/theme/colors';
import cx from 'classnames';

type Props = {
	tournament: TournamentWithFullDetailsRecord;
};

type Status = 'Pending' | 'In Progress' | 'Completed';

export const TournamentBanner: React.FC<Props> = ({ tournament }) => {
	const cls = useStyles();
	const auth = useAuthentication();
	const [iAmParticipating, setIAmParticipating] = useState<boolean>(false);

	useEffect(() => {
		if (auth.authenticationType !== 'user') {
			return;
		}

		setIAmParticipating(!!tournament.participants.find((p) => p.user.id === auth.user.id));
	}, [auth.authenticationType]);

	function getTournamentStatus(state: TournamentWithFullDetailsRecord['state']): Status {
		return state === 'pending'
			? 'Pending'
			: state === 'complete' || state === 'ended'
			? 'Completed'
			: 'In Progress';
	}

	return (
		<div className={cls.container}>
			<div className={cls.logo}>
				<img
					src="https://innatepi.sirv.com/events/tournaments/mtm_ukraine/tournament_logo.svg"
					alt="Tournament Logo"
					style={{
						width: '190px',
						height: '124px',
						...onlyMobile({
							width: '100px',
							height: '65px',
						}),
					}}
				/>
			</div>
			<div className={cls.details}>
				<div className={cls.topRow}>
					<div className={cls.date}>
						<Text style={{ textAlign: 'center' }} size="tiny2">
							{tournament.startAt && `${dateformat(tournament.startAt, 'mmm')}`}
						</Text>
						<Text style={{ textAlign: 'center' }} size="subtitle1">
							{tournament.startAt && `${dateformat(tournament.startAt, 'dd')}`}
						</Text>
					</div>
					<div className={cls.title}>
						<Text size="title2">
							{tournament.name.charAt(0).toUpperCase() + tournament.name.slice(1)}
						</Text>
					</div>
				</div>
				<div className={cls.bottomRow}>
					<div className={cls.status}>
						<Text size="body1">{getTournamentStatus(tournament.state)}</Text>
					</div>
					<div className={cls.info}>
						<Text size="body1">{`${
							tournament.tournamentType.charAt(0).toUpperCase() + tournament.tournamentType.slice(1)
						}  ${
							tournament.state !== 'pending' ? ' - ' + tournament.swissRounds + ' Rounds' : ''
						}`}</Text>
					</div>
					<div className={cls.participants}>
						<People set="bold" />
						<Text size="body1">{`Participants: ${tournament.participantsCount}`}</Text>
					</div>
					<div>
						<AuthenticationBouncer
							onAuthenticated={({ user }) => {
								createTournamentParticipant({
									tournamentId: tournament.id,
								}).map(() => setIAmParticipating(true));
							}}
							render={(state) => (
								<Button
									label={
										iAmParticipating
											? 'You are Participanting'
											: tournament.state === 'pending'
											? 'Join'
											: 'Registration Closed'
									}
									disabled={iAmParticipating || tournament.state !== 'pending'}
									type="positive"
									style={{
										marginBottom: '0px',
										paddingLeft: '10px',
										paddingRight: '10px',
										fontWeight: 'normal',
									}}
									onClick={() => {
										if (!state.isAuthenticated) {
											state.check();
										}
									}}
								/>
							)}
						/>
					</div>
					{/*<div className={cls.date}>
						<Text size="small1" color={colors.universal.white}>
							{tournament.startAt && `${dateformat(tournament.startAt, 'dd, mmmm, yyyy')}`}
						</Text>
					</div>*/}
				</div>
			</div>
		</div>
	);
};

const useStyles = createUseStyles((theme) => ({
	container: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		// minWidth: '30rem',
		// maxWidth: '60rem',
		background: theme.name === 'darkDefault' ? theme.colors.neutralLight : '#423182',
		color: colors.universal.white,
		...(theme.name === 'lightDefault' && { ...softBorderRadius, ...floatingShadow }),
		paddingTop: spacers.default,
		paddingBottom: spacers.small,
	},
	details: {
		display: 'flex',
		flexDirection: 'column',
		gap: spacers.default,
		justifyContent: 'space-between',
		flex: 1,
		paddingLeft: spacers.large,
	},
	logo: {},
	topRow: {
		display: 'flex',
		justifyContent: 'flex-start',
		paddingLeft: spacers.large,
		paddingTop: spacers.default,
	},
	bottomRow: {
		display: 'flex',
		gap: spacers.largest,
		paddingLeft: spacers.large,
		paddingBottom: spacers.default,
	},
	title: {
		alignSelf: 'center',
		flex: 1,
		paddingLeft: spacers.default,
	},
	status: {
		color: theme.colors.attention,
		fontWeight: 'bold',
		alignSelf: 'center',
	},
	info: {
		alignSelf: 'center',
	},
	date: {
		alignSelf: 'center',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignContent: 'center',
		backgroundColor: colors.universal.white,
		...softBorderRadius,
		color: colors.universal.black,
		padding: spacers.small,
		width: '2em',
		height: '2em',
	},
	dateWhite: {
		backgroundColor: colors.universal.white,
		color: colors.universal.black,
	},
	dateDark: {
		backgroundColor: theme.colors.neutralDark,
	},
	participants: {
		display: 'flex',
		gap: spacers.small,
		alignItems: 'center',
	},
}));
