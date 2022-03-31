import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { softBorderRadius } from 'src/theme';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { spacers } from 'src/theme/spacers';
import { TournamentMatchRecord } from '../../types';
import whitePiece from './assets/white_piece.svg';
import blackPiece from './assets/black_piece.svg';

type Props = {
	match: TournamentMatchRecord;
};

export const MatchViewer: React.FC<Props> = ({ match }) => {
	const cls = useStyles();
	const colors = useColorTheme().theme.colors;

	return (
		<div className={cls.container}>
			<div
				className={cls.playerContainer}
				style={{
					borderBottom: `1px solid ${colors.background}`,
				}}
			>
				<div
					className={cls.playerBox}
					style={{
						borderTopLeftRadius: spacers.small,
					}}
				>
					{match.players && match.players[0].user.name}
				</div>
				<div
					className={cls.scoreBox}
					style={{
						backgroundColor:
							match.winner === 'white' || match.winner === '1/2'
								? colors.attention
								: colors.neutralLight,
						borderTopRightRadius: spacers.small,
						color: match.winner === 'white' || match.winner === '1/2' ? '#000' : '#ddd',
					}}
				>
					{match.winner === 'white' || match.winner === '1/2' ? 1 : 0}
				</div>
			</div>
			<div
				className={cls.playerContainer}
				style={{
					borderTop: `1px solid ${colors.background}`,
				}}
			>
				<div
					className={cls.playerBox}
					style={{
						borderBottomLeftRadius: spacers.small,
					}}
				>
					{match.players && match.players[1].user.name}
				</div>
				<div
					className={cls.scoreBox}
					style={{
						backgroundColor:
							match.winner === 'black' || match.winner === '1/2'
								? colors.attention
								: colors.neutralLight,
						borderBottomRightRadius: spacers.small,
						color: match.winner === 'black' || match.winner === '1/2' ? '#000' : '#ddd§',
					}}
				>
					{match.winner === 'black' || match.winner === '1/2' ? 1 : 0}
				</div>
			</div>
		</div>
	);
};

const useStyles = createUseStyles((theme) => ({
	container: {
		display: 'flex',
		flexDirection: 'column',
		maxWidth: '300px',
		backgroundColor: theme.colors.neutralLight,
		color: theme.text.baseColor,
		...softBorderRadius,
	},
	playerContainer: {
		display: 'flex',
	},
	border: {
		height: '1px',
		width: '100%',
		backgroundColor: theme.colors.neutralDarkest,
	},
	playerBox: {
		display: 'flex',
		flex: 1,
		textAlign: 'left',
		justifyContent: 'flex-start',
		padding: spacers.small,
	},
	scoreBox: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		alignContent: 'center',
		padding: spacers.small,
		paddingLeft: spacers.small,
		paddingRight: spacers.small,
		borderLeft: `1px solid ${theme.colors.background}`,
	},
}));
