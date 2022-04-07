import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { floatingShadow, fonts, hardFloatingShadow, softBorderRadius } from 'src/theme';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { spacers } from 'src/theme/spacers';
import { TournamentMatchRecord } from '../../types';
import whitePiece from './assets/white_piece.svg';
import blackPiece from './assets/black_piece.svg';
import { JoinableMatch } from './JoinableMatch';
import { getUserDisplayNameClean } from 'src/modules/User';
import { ChessGameColor } from 'chessroulette-io';

type Props = {
	match: TournamentMatchRecord;
};

export const MatchViewer: React.FC<Props> = ({ match }) => {
	const cls = useStyles();
	const theme = useColorTheme().theme;
	const { colors } = theme;

	if (match.state === 'underway' || match.state === 'inProgress')
		return <JoinableMatch match={match} />;

	const getBackgroundColorForPlayer = (player: ChessGameColor): string => {
		//Pending
		return match.state === 'pending'
			? theme.colors.neutralLight
			: //Open
			match.state === 'open'
			? theme.name === 'darkDefault'
				? theme.colors.secondaryDark
				: theme.colors.primaryHover
			: //Completed
			//Win
			match.winner === player
			? 'linear-gradient(rgb(188, 63, 149) 0%, rgb(115, 70, 185) 170%)'
			: //Draw
			theme.name === 'darkDefault'
			? theme.colors.neutralDark
			: theme.colors.neutralLight;
	};

	return (
		<div className={cls.container}>
			<div
				className={cls.playerContainer}
				style={{
					borderBottom: `1px solid ${colors.background}`,
				}}
			>
				{match.winner === '1/2' && (
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
							match.winner === 'white' && {
								color: 'white',
								fontWeight: 'bold',
							}),
						...(match.winner &&
							match.winner === '1/2' && {
								color: theme.text.baseColor,
								fontWeight: 'bold',
							}),
						...(match.state === 'open' && {
							color: 'white',
						}),
						background: getBackgroundColorForPlayer('white'),
					}}
				>
					{match.players ? getUserDisplayNameClean(match.players[0].user) : `TBD`}
				</div>
				<div
					className={cls.scoreBox}
					style={{
						borderTopRightRadius: spacers.small,
						background: getBackgroundColorForPlayer('white'),
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
				{match.winner === '1/2' && (
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
							match.winner === 'black' && {
								color: 'white',
								fontWeight: 'bold',
							}),
						...(match.winner &&
							match.winner === '1/2' && {
								color: theme.text.baseColor,
								fontWeight: 'bold',
							}),
						...(match.state === 'open' && {
							color: 'white',
						}),
						background: getBackgroundColorForPlayer('black'),
					}}
				>
					{match.players ? getUserDisplayNameClean(match.players[1].user) : `TBD`}
				</div>
				<div
					className={cls.pieceBox}
					style={{
						borderBottomRightRadius: spacers.small,
						background: getBackgroundColorForPlayer('black'),
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
		...hardFloatingShadow,
	},
	playerContainer: {
		display: 'flex',
		position: 'relative',
	},
	winnerBorder: {
		position: 'absolute',
		height: '100%',
		width: '1rem',
		left: '-0.5rem',
		zIndex: 1,
		background: 'linear-gradient(136.43deg, #508EC7 48.97%, #8E52C4 63.79%)',
	},
	drawBorder: {
		position: 'absolute',
		height: '100%',
		width: '1rem',
		left: '-0.5rem',
		zIndex: 1,
		background: 'linear-gradient(90deg, #D833D1 8.97%,#508EC7 61.43%)',
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
	},
	scoreBox: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		alignContent: 'center',
		padding: spacers.small,
		paddingLeft: spacers.small,
		paddingRight: spacers.small,
	},
}));
