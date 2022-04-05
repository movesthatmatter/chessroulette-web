import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { fonts, softBorderRadius } from 'src/theme';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { spacers } from 'src/theme/spacers';
import { TournamentMatchRecord } from '../../types';
import whitePiece from './assets/white_piece.svg';
import blackPiece from './assets/black_piece.svg';
import { JoinableMatch } from './JoinableMatch';

type Props = {
	match: TournamentMatchRecord;
};

export const MatchViewer: React.FC<Props> = ({ match }) => {
	const cls = useStyles();
	const theme = useColorTheme().theme;
	const { colors } = theme;

	if (match.state === 'underway') return <JoinableMatch match={match} />;

	return (
		<div
			className={cls.container}
			style={{
				backgroundColor: theme.colors.neutralDark,
			}}
		>
			{match.state === 'inProgress' && <div className={cls.liveIcon} />}
			<div
				className={cls.playerContainer}
				style={{
					borderBottom: `1px solid ${colors.background}`,
				}}
			>
				{match.winner && match.winner === 'white' && (
					<div
						className={cls.winnerBorder}
						style={{
							borderTopLeftRadius: spacers.small,
						}}
					/>
				)}
				{match.winner && match.winner === '1/2' && (
					<div
						className={cls.drawBorder}
						style={{
							borderTopLeftRadius: spacers.small,
						}}
					/>
				)}
				<div
					className={cls.playerBox}
					style={{
						borderTopLeftRadius: spacers.small,
						...(match.winner &&
							(match.winner === 'white' || match.winner === '1/2') && {
								color: theme.text.baseColor,
							}),
						...((match.state === 'open' || match.state === 'inProgress') && {
							color: 'white',
						}),
						backgroundColor:
							match.state === 'inProgress'
								? theme.colors.primary
								: match.state === 'complete'
								? theme.colors.neutralLight
								: theme.colors.neutralDark,
					}}
				>
					{match.players ? match.players[0].user.name : `TBD`}
				</div>
				<div
					className={cls.scoreBox}
					style={{
						borderTopRightRadius: spacers.small,
						backgroundColor:
							match.state === 'inProgress'
								? theme.colors.primary
								: match.state === 'complete'
								? theme.colors.neutralLight
								: theme.colors.neutralDark,
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
				{match.winner && match.winner === 'black' && (
					<div
						className={cls.winnerBorder}
						style={{
							borderBottomLeftRadius: spacers.small,
						}}
					/>
				)}
				{match.winner && match.winner === '1/2' && (
					<div
						className={cls.drawBorder}
						style={{
							borderBottomLeftRadius: spacers.small,
						}}
					/>
				)}
				<div
					className={cls.playerBox}
					style={{
						borderBottomLeftRadius: spacers.small,
						...(match.winner &&
							(match.winner === 'black' || match.winner === '1/2') && {
								color: theme.text.baseColor,
							}),
						...((match.state === 'open' || match.state === 'inProgress') && {
							color: 'white',
						}),
						backgroundColor:
							match.state === 'inProgress'
								? theme.colors.primary
								: match.state === 'complete'
								? theme.colors.neutralLight
								: theme.colors.neutralDark,
					}}
				>
					{match.players ? match.players[1].user.name : `TBD`}
				</div>
				<div
					className={cls.pieceBox}
					style={{
						borderBottomRightRadius: spacers.small,
						backgroundColor:
							match.state === 'inProgress'
								? theme.colors.primary
								: match.state === 'complete'
								? theme.colors.neutralLight
								: theme.colors.neutralDark,
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
	liveIcon: {
		width: '11px',
		height: '11px',
		borderRadius: '50%',
		backgroundColor: '#FF33A1',
		border: `2px solid ${theme.colors.background}`,
		position: 'absolute',
		top: '-5px',
		left: '-5px',
		zIndex: 50,
	},
	playerContainer: {
		display: 'flex',
		position: 'relative',
	},
	winnerBorder: {
		position: 'absolute',
		height: '100%',
		width: '50%',
		left: '-0.5rem',
		zIndex: 1,
		background: 'linear-gradient(136.43deg, #D833D1 8.97%, #8E52C4 52.35%, #508EC7 101.43%)',
	},
	drawBorder: {
		position: 'absolute',
		height: '100%',
		width: '50%',
		left: '-0.5rem',
		zIndex: 1,
		background: 'linear-gradient(136.43deg, #508EC7 8.97%, #8E52C4 43.79%)',
	},
	playerBox: {
		display: 'flex',
		flex: 1,
		textAlign: 'left',
		justifyContent: 'flex-start',
		padding: spacers.small,
		zIndex: 10,
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
