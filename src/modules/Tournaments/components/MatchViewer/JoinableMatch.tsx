import React from 'react';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import { fonts, softBorderRadius } from 'src/theme';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { spacers } from 'src/theme/spacers';
import { TournamentMatchRecord } from '../../types';
import whitePiece from './assets/white_piece.svg';
import blackPiece from './assets/black_piece.svg';
import {
	TournamentOpenMatchRecord,
	TournamentUnderwayMatchRecord,
} from 'chessroulette-io/dist/resourceCollections/tournaments/records';
import { useAuthentication } from 'src/services/Authentication';
import cx from 'classnames';

type Props = {
	match: TournamentUnderwayMatchRecord;
};

export const JoinableMatch: React.FC<Props> = ({ match }) => {
	const cls = useStyles();
	const theme = useColorTheme().theme;
	const { colors } = theme;
	const auth = useAuthentication();

	const joinMatch = () => {
		console.log('JOIN match!!');
	};

	const player1Class =
		auth.authenticationType === 'user' && auth.user.id === match.players[0].user.id
			? cls.playable
			: cls.nonPlayable;
	const player2Class =
		auth.authenticationType === 'user' && auth.user.id === match.players[1].user.id
			? cls.playable
			: cls.nonPlayable;

	return (
		<div
			className={cls.container}
			style={{
				backgroundColor: theme.colors.neutralDark,
			}}
		>
			<div
				className={cls.playerContainer}
				style={{
					borderBottom: `1px solid ${colors.background}`,
				}}
			>
				<div
					className={cx(cls.playerBox, player1Class)}
					style={{
						borderTopLeftRadius: spacers.small,
					}}
					onClick={() => joinMatch()}
				>
					{match.players[0].user.name}
				</div>
				<div
					className={cls.scoreBox}
					style={{
						borderTopRightRadius: spacers.small,
					}}
				>
					<img src={whitePiece} alt="white" />
				</div>
			</div>
			<div
				className={cls.playerContainer}
				style={{
					borderTop: `1px solid ${colors.background}`,
				}}
			>
				<div
					className={cx(cls.playerBox, player2Class)}
					onClick={() => joinMatch()}
					style={{
						borderBottomLeftRadius: spacers.small,
					}}
				>
					{match.players[1].user.name}
				</div>
				<div
					className={cls.pieceBox}
					style={{
						borderBottomRightRadius: spacers.small,
					}}
				>
					<img src={blackPiece} alt="black" />
				</div>
			</div>
		</div>
	);
};

const useStyles = createUseStyles((theme) => ({
	container: {
		display: 'flex',
		flexDirection: 'column',
		position: 'relative',
		maxWidth: '25rem',
		minWidth: '15rem',
		color: theme.text.subtle,
		...fonts.small1,
		...softBorderRadius,
	},
	playable: {
		backgroundColor: theme.colors.positive,
		'&:hover': {
			backgroundColor: theme.colors.primary,
			textDecoration: 'none',
			cursor: 'pointer',
		},
	},
	nonPlayable: {
		backgroundColor: theme.colors.neutralDark,
	},
	playerContainer: {
		display: 'flex',
		position: 'relative',
	},
	playerBox: {
		display: 'flex',
		flex: 1,
		textAlign: 'left',
		justifyContent: 'flex-start',
		padding: spacers.small,
		zIndex: 10,
		color: theme.text.baseColor,
	},
	pieceBox: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		alignContent: 'center',
		padding: spacers.small,
		paddingLeft: spacers.small,
		paddingRight: spacers.small,
		borderLeft: `1px solid ${theme.colors.background}`,
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
