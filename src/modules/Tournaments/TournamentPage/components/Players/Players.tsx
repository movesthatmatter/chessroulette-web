import React, { useEffect, useState } from 'react';
import { Avatar } from 'src/components/Avatar';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { TournamentWithFullDetailsRecord } from 'src/modules/Tournaments/types';
import { determineNoWinsAndPointsPerParticipant } from 'src/modules/Tournaments/utils';
import { useAuthenticatedUser } from 'src/services/Authentication';
import { fonts } from 'src/theme';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { spacers } from 'src/theme/spacers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { getUserDisplayName } from 'src/modules/User';
import { GradientText } from 'src/components/GradientText';

type Props = {
	tournament: TournamentWithFullDetailsRecord;
};

export const Players: React.FC<Props> = ({ tournament }) => {
	const cls = useStyles();
	const theme = useColorTheme().theme;
	const auth = useAuthenticatedUser();
	const [winnerAndRunnerUp, setWinnerAndRunnerUp] = useState<
		{ '1': string; '2': string } | undefined
	>(undefined);

	const [winsAndPointsPerPlayer, setWinsAndPointsPerPlayer] = useState(
		determineNoWinsAndPointsPerParticipant(tournament.matches)
	);

	useEffect(() => {
		setWinsAndPointsPerPlayer(determineNoWinsAndPointsPerParticipant(tournament.matches));
	}, [tournament]);

	useEffect(() => {
		if (
			(tournament.state === 'complete' || tournament.state === 'ended') &&
			typeof winnerAndRunnerUp === 'undefined'
		) {
			setWinnerAndRunnerUp(() => {
				const ordered = Object.keys(winsAndPointsPerPlayer).sort(
					(a, b) => winsAndPointsPerPlayer[b].points - winsAndPointsPerPlayer[a].points
				);
				return {
					1: ordered[0],
					2: ordered[1],
				};
			});
		}
	}, [tournament]);

	if (tournament.matches.length === 0) {
		return (
			<div className={cls.container}>
				<div className={cls.playersContainer}>
					<div className={cls.playersContainerTitle}>
						<div className={cls.playersTitle} />
						<div className={cls.playersTitle} style={{ width: '5rem' }}>
							Wins
						</div>
						<div className={cls.playersTitle} style={{ width: '5rem' }}>
							Points
						</div>
					</div>
					<div className={cls.playersContainerContent}>
						{tournament.participants.map((p, i) => (
							<div
								className={cls.playerRow}
								style={{
									background:
										i % 2 === 0
											? theme.name === 'darkDefault'
												? `linear-gradient(270.03deg, ${theme.colors.neutralDark} 0.35%, rgba(231, 223, 255, 0) 100.9%)`
												: `linear-gradient(270.03deg, ${theme.colors.primaryLightest} 0.35%, rgba(231, 223, 255, 0) 100.9%)`
											: theme.colors.background,
								}}
							>
								<div
									className={cls.player}
									style={{
										...(auth &&
											auth.id === p.user.id && {
												fontWeight: 'bold',
												color: theme.colors.primary,
											}),
									}}
								>
									<Avatar mutunachiId={+p.user.avatarId} />
									{getUserDisplayName(p.user)}
								</div>
								<div className={cls.wins}>
									<Text size="body2" style={{ fontWeight: 'bold' }}>
										0
									</Text>
								</div>
								<div className={cls.wins}>
									<Text size="body2" style={{ fontWeight: 'bold' }}>
										0
									</Text>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={cls.container}>
			{(tournament.state === 'ended' || tournament.state === 'complete') && winnerAndRunnerUp && (
				<div className={cls.completeContainer}>
					<Text size="subtitle1">Congratulations to our winner and runner-up :</Text>
					<div className={cls.podiumContainer}>
						<div className={cls.podiumPlace}>
							<div className={cls.firstPlaceContariner} />
							<div className={cls.playerContainer}>
								<Avatar
									mutunachiId={+winsAndPointsPerPlayer[winnerAndRunnerUp[1]].user.avatarId}
									size={50}
								/>
								<Text size="body1" style={{ fontWeight: 'bold' }}>
									{getUserDisplayName(winsAndPointsPerPlayer[winnerAndRunnerUp[1]].user)}
								</Text>
							</div>
						</div>
						<div className={cls.podiumPlace}>
							<div className={cls.secondPlaceContainer} />
							<div className={cls.playerContainer}>
								<Avatar
									mutunachiId={+winsAndPointsPerPlayer[winnerAndRunnerUp[2]].user.avatarId}
									size={50}
								/>
								<Text size="body1">
									{getUserDisplayName(winsAndPointsPerPlayer[winnerAndRunnerUp[2]].user)}
								</Text>
							</div>
						</div>
					</div>
				</div>
			)}
			<div className={cls.playersContainer}>
				<div className={cls.playersContainerTitle}>
					<div className={cls.playersTitle} />
					<div className={cls.playersTitle} style={{ width: '5rem' }}>
						<GradientText gradientCSSProp="linear-gradient(102.34deg, #FF32A1 22.52%, #D833D1 85.01%)">
							Wins
						</GradientText>
					</div>
					<div className={cls.playersTitle} style={{ width: '5rem' }}>
						<GradientText gradientCSSProp="linear-gradient(102.34deg, #FF32A1 22.52%, #D833D1 85.01%)">
							Points
						</GradientText>
					</div>
				</div>
				<div className={cls.playersContainerContent}>
					{Object.keys(winsAndPointsPerPlayer)
						.sort((a, b) => winsAndPointsPerPlayer[b].points - winsAndPointsPerPlayer[a].points)
						.map((p, i) => (
							<div
								className={cls.playerRow}
								style={{
									background:
										i % 2 === 0
											? theme.name === 'darkDefault'
												? `linear-gradient(270.03deg, ${theme.colors.neutralDark} 0.35%, rgba(231, 223, 255, 0) 100.9%)`
												: `linear-gradient(270.03deg, ${theme.colors.primaryLightest} 0.35%, rgba(231, 223, 255, 0) 100.9%)`
											: theme.colors.background,
								}}
							>
								<div
									className={cls.player}
									style={{
										...(auth &&
											auth.id === winsAndPointsPerPlayer[p].user.id && {
												fontWeight: 'bold',
												color: theme.colors.primary,
											}),
									}}
								>
									<Avatar mutunachiId={+winsAndPointsPerPlayer[p].user.avatarId} />
									{getUserDisplayName(winsAndPointsPerPlayer[p].user)}
									{i === 0 && (
										<FontAwesomeIcon
											icon={faCrown}
											size="lg"
											color={theme.name === 'darkDefault' ? '#FDE615' : '#25282b'}
										/>
									)}
								</div>
								<div className={cls.wins}>
									<Text size="body2" style={{ fontWeight: 'bold' }}>
										{winsAndPointsPerPlayer[p] && winsAndPointsPerPlayer[p].wins}
									</Text>
								</div>
								<div className={cls.wins}>
									<Text size="body2" style={{ fontWeight: 'bold' }}>
										{winsAndPointsPerPlayer[p] && winsAndPointsPerPlayer[p].points}
									</Text>
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
};

const useStyles = createUseStyles((theme) => ({
	container: {
		display: 'flex',
		flexDirection: 'column',
		paddingTop: spacers.large,
	},
	completeContainer: {
		display: 'flex',
		flexDirection: 'column',
		gap: spacers.largest,
		marginTop: spacers.large,
		marginBottom: spacers.largest,
	},
	podiumContainer: {
		display: 'flex',
	},
	podiumPlace: {
		display: 'flex',
		flexDirection: 'column-reverse',
	},
	firstPlaceContariner: {
		background: '#8B63FE',
		width: '300px',
		height: '180px',
	},
	secondPlaceContainer: {
		background: '#A88BFF',
		width: '270px',
		height: '100px',
	},
	playerContainer: {
		display: 'flex',
		gap: spacers.default,
		paddingLeft: spacers.small,
		paddingBottom: spacers.small,
		alignItems: 'center',
	},
	playersContainer: {
		display: 'flex',
		flexDirection: 'column',
		gap: spacers.large,
		minWidth: '30rem',
	},
	playersContainerTitle: {
		display: 'flex',
		justifyContent: 'space-between',
		width: '100%',
	},
	playersTitle: {
		color: theme.colors.primary,
		...fonts.body1,
		fontWeight: 'bold',
		'&:last-child': {
			display: 'flex',
			justifyContent: 'flex-end',
			textAlign: 'right',
			paddingRight: spacers.large,
		},
		'&:first-child': {
			display: 'flex',
			justifyContent: 'flex-start',
			textAlign: 'left',
			flex: 1,
		},
	},
	playerRow: {
		display: 'flex',
		justifyContent: 'space-between',
		paddingTop: spacers.small,
		paddingBottom: spacers.small,
		width: '100%',
	},
	playersContainerContent: {
		display: 'flex',
		flexDirection: 'column',
	},
	player: {
		display: 'flex',
		gap: spacers.default,
		color: theme.text.baseColor,
		alignItems: 'center',
		flex: 1,
		...fonts.small1,
	},
	wins: {
		color: theme.text.baseColor,
		...fonts.small1,
		width: '5rem',
		'&:first-child': {
			textAlign: 'center',
		},
		'&:last-child': {
			textAlign: 'center',
			paddingRight: spacers.default,
		},
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	},
}));
