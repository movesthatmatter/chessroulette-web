import React, { useEffect, useState } from 'react';
import { Avatar } from 'src/components/Avatar';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { TournamentWithFullDetailsRecord } from 'src/modules/Tournaments/types';
import { determineNoWinsAndPointsPerParticipant } from 'src/modules/Tournaments/utils';
import { PeerAvatar } from 'src/providers/PeerConnectionProvider';
import { fonts } from 'src/theme';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { spacers } from 'src/theme/spacers';

type Props = {
	tournament: TournamentWithFullDetailsRecord;
};

export const Players: React.FC<Props> = ({ tournament }) => {
	const cls = useStyles();
	const theme = useColorTheme().theme;

	const [winsAndPointsPerPlayer, setWinsAndPointsPerPlayer] = useState(
		determineNoWinsAndPointsPerParticipant(tournament.matches)
	);

	console.log('wins per player', winsAndPointsPerPlayer);

	useEffect(() => {
		console.log('tournament in players : ', tournament);
	}, [tournament]);

	useEffect(() => {
		setWinsAndPointsPerPlayer(determineNoWinsAndPointsPerParticipant(tournament.matches));
	}, [tournament]);

	return (
		<div className={cls.container}>
			<div className={cls.playersContainer}>
				<div className={cls.playersContainerTitle}>
					<div className={cls.playersTitle}>Players</div>
					<div className={cls.playersTitle} style={{ width: '5rem' }}>
						Wins
					</div>
					<div className={cls.playersTitle} style={{ width: '5rem' }}>
						Points
					</div>
				</div>
				<div className={cls.playersContainerContent}>
					{Object.keys(winsAndPointsPerPlayer)
						.sort((a, b) => winsAndPointsPerPlayer[b].points - winsAndPointsPerPlayer[a].points)
						.map((p, i) => (
							<div
								className={cls.playerRow}
								style={{
									backgroundColor:
										i % 2 === 0
											? theme.name === 'darkDefault'
												? theme.colors.neutralDark
												: theme.colors.primaryLightest
											: theme.colors.background,
								}}
							>
								<div className={cls.player}>
									<Avatar mutunachiId={+winsAndPointsPerPlayer[p].user.avatarId} />
									{winsAndPointsPerPlayer[p].user.name}
								</div>
								<div className={cls.wins}>
									<Text>{winsAndPointsPerPlayer[p] && winsAndPointsPerPlayer[p].wins}</Text>
								</div>
								<div className={cls.wins}>
									<Text>{winsAndPointsPerPlayer[p] && winsAndPointsPerPlayer[p].points}</Text>
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
};

const useStyles = createUseStyles((theme) => ({
	container: {},
	playersContainer: {
		display: 'flex',
		flexDirection: 'column',
		gap: spacers.default,
		maxWidth: '30rem',
	},
	playersContainerTitle: {
		display: 'flex',
		justifyContent: 'space-between',
		width: '100%',
	},
	playersTitle: {
		color: theme.colors.primary,
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
		padding: spacers.small,
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
	},
}));
