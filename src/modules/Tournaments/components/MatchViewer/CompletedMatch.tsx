import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { fonts, hardFloatingShadow, softBorderRadius } from 'src/theme';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { spacers } from 'src/theme/spacers';
import whitePiece from '../../assets/white_piece.svg';
import blackPiece from '../../assets/black_piece.svg';
import { TournamentCompleteMatchRecord } from 'chessroulette-io/dist/resourceCollections/tournaments/records';
import { ChessGameColor } from 'chessroulette-io';
import { getUserDisplayName } from 'src/modules/User';
import { Text } from 'src/components/Text';
import dateformat from 'dateformat';
import { Avatar } from 'src/components/Avatar';

type Props = {
	match: TournamentCompleteMatchRecord;
};

export const CompletedMatch: React.FC<Props> = ({ match }) => {
	const cls = useStyles();
	const theme = useColorTheme().theme;
	const { colors } = theme;
	const [mouseOver, setMouseOver] = useState(false);

	function determineBackgroundColor(player: ChessGameColor) {
		return match.winner === player
			? theme.name === 'darkDefault'
				? 'linear-gradient(180deg, #BC3F95 0%, #7346B9 100%)'
				: 'linear-gradient(180deg, #5FD8F9 0%, #BE6ED9 128.12%)'
			: theme.name === 'darkDefault'
			? '#3A446A'
			: theme.colors.primaryLightest;
	}

	return (
		<div className={cls.match}>
			<div className={cls.container}>
				<div
					className={cls.playerContainer}
					style={{
						borderBottom: `1px solid ${colors.background}`,
					}}
					onMouseOver={() => setMouseOver(true)}
					onMouseOut={() => setMouseOver(false)}
					onFocus={() => setMouseOver(true)}
					onBlur={() => setMouseOver(false)}
				>
					<div
						className={cls.border}
						style={{
							borderTopLeftRadius: spacers.small,
						}}
					/>
					<div
						className={cls.playerBox}
						style={{
							borderTopLeftRadius: spacers.small,
							...((match.winner === 'white' || match.winner === '1/2') && {
								color: theme.text.baseColor,
								fontWeight: 'bold',
							}),
							...(mouseOver
								? {
										background: theme.name === 'darkDefault' ? '#D833D1' : '#88ABEC',
								  }
								: {
										background: determineBackgroundColor('white'),
								  }),
						}}
					>
						<Avatar mutunachiId={+match.players[0].user.avatarId} size={20} />
						<div>{getUserDisplayName(match.players[0].user)}</div>
					</div>
					<div
						className={cls.pieceBox}
						style={{
							borderTopRightRadius: spacers.small,
							...(mouseOver
								? {
										background: theme.name === 'darkDefault' ? '#D833D1' : '#88ABEC',
								  }
								: {
										background: determineBackgroundColor('white'),
								  }),
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
					onMouseOver={() => setMouseOver(true)}
					onMouseOut={() => setMouseOver(false)}
					onFocus={() => setMouseOver(true)}
					onBlur={() => setMouseOver(false)}
				>
					<div
						className={cls.border}
						style={{
							borderBottomLeftRadius: spacers.small,
						}}
					/>
					<div
						className={cls.playerBox}
						style={{
							borderBottomLeftRadius: spacers.small,
							...((match.winner === 'black' || match.winner === '1/2') && {
								color: theme.text.baseColor,
								fontWeight: 'bold',
							}),
							...(mouseOver
								? {
										background: theme.name === 'darkDefault' ? '#D833D1' : '#88ABEC',
								  }
								: {
										background: determineBackgroundColor('black'),
								  }),
						}}
					>
						<Avatar mutunachiId={+match.players[1].user.avatarId} size={20} />
						<div>{getUserDisplayName(match.players[1].user)}</div>
					</div>
					<div
						className={cls.pieceBox}
						style={{
							borderBottomRightRadius: spacers.small,
							...(mouseOver
								? {
										background: theme.name === 'darkDefault' ? '#D833D1' : '#88ABEC',
								  }
								: {
										background: determineBackgroundColor('black'),
								  }),
						}}
					>
						<img src={blackPiece} alt="black" />
					</div>
				</div>
			</div>
			<div className={cls.status}>
				<Text size="tiny1" style={{ fontStyle: 'italic' }}>
					Completed
				</Text>
				<Text size="tiny2">{dateformat(match.completedAt, 'dd mmmm h:MM TT')}</Text>
			</div>
		</div>
	);
};

const useStyles = createUseStyles((theme) => ({
	match: {
		display: 'flex',
		flexDirection: 'column',
	},
	container: {
		display: 'flex',
		flexDirection: 'column',
		position: 'relative',
		maxWidth: '25rem',
		minWidth: '15rem',
		color: theme.text.baseColor,
		...fonts.small1,
		...softBorderRadius,
		...hardFloatingShadow,
	},
	border: {
		position: 'absolute',
		height: '100%',
		width: '1rem',
		left: '-6px',
		zIndex: 1,
		background: 'linear-gradient(136.43deg, #D833D1 8.97%, #8E52C4 52.35%, #508EC7 101.43%)',
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
		alignItems: 'center',
		gap: spacers.small,
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
	status: {
		marginTop: spacers.smaller,
		display: 'flex',
		gap: spacers.default,
		color: theme.text.baseColor,
	},
}));
