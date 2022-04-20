import React, { useState } from 'react';
import { createUseStyles, NestedCSSElement } from 'src/lib/jss';
import {
	CustomTheme,
	fonts,
	hardFloatingShadow,
	softBorderRadius,
	textShadowDarkMode,
} from 'src/theme';
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
import { colors } from 'src/theme/colors';

type Props = {
	match: TournamentCompleteMatchRecord;
};

function determineBackgroundColor(
	match: TournamentCompleteMatchRecord,
	theme: CustomTheme,
	player: ChessGameColor
) {
	return match.winner === player
		? theme.name === 'darkDefault'
			? 'linear-gradient(180deg, #BC3F95 0%, #7346B9 100%)'
			: 'linear-gradient(180deg, #5FD8F9 0%, #BE6ED9 128.12%)'
		: theme.name === 'darkDefault'
		? '#3A446A'
		: theme.colors.primaryLightest;
}

export const CompletedMatch: React.FC<Props> = ({ match }) => {
	const cls = useStyles();
	const theme = useColorTheme().theme;
	const { colors } = theme;

	return (
		<div className={cls.match}>
			<div className={cls.container}>
				<div
					className={cls.playerContainer}
					style={{
						borderBottom: `1px solid ${colors.background}`,
					}}
				>
					<div
						className={cls.border}
						style={{
							borderTopLeftRadius: spacers.small,
						}}
					>
						<div className={cls.scoreContainer}>
							<Text size="subtitle1" style={{ fontWeight: 'bold', paddingRight: '5px' }}>
								{match.winner === 'white' || match.winner === '1/2' ? '1' : '0'}
							</Text>
						</div>
					</div>
					<div
						className={cls.playerBox}
						style={{
							borderTopLeftRadius: spacers.small,
							...((match.winner === 'white' || match.winner === '1/2') && {
								color: theme.text.baseColor,
								fontWeight: 'bold',
							}),
							background: determineBackgroundColor(match, theme, 'white'),
						}}
					>
						<Avatar mutunachiId={+match.players[0].user.avatarId} size={20} />
						<div style={{ maxWidth: '7rem' }}>{getUserDisplayName(match.players[0].user)}</div>
					</div>
					<div
						className={cls.pieceBox}
						style={{
							borderTopRightRadius: spacers.small,

							background: determineBackgroundColor(match, theme, 'white'),
						}}
					>
						<img src={whitePiece} alt="white" />
					</div>
				</div>
				<div
					className={cls.playerContainer}
					style={{ borderTop: `1px solid ${colors.background}` }}
				>
					<div
						className={cls.border}
						style={{
							borderBottomLeftRadius: spacers.small,
						}}
					>
						<div className={cls.scoreContainer}>
							<Text size="subtitle1" style={{ fontWeight: 'bold', paddingRight: '5px' }}>
								{match.winner === 'black' || match.winner === '1/2' ? '1' : '0'}
							</Text>
						</div>
					</div>
					<div
						className={cls.playerBox}
						style={{
							borderBottomLeftRadius: spacers.small,
							...((match.winner === 'black' || match.winner === '1/2') && {
								color: theme.text.baseColor,
								fontWeight: 'bold',
							}),
							background: determineBackgroundColor(match, theme, 'black'),
						}}
					>
						<Avatar mutunachiId={+match.players[1].user.avatarId} size={20} />
						<div style={{ maxWidth: '7rem' }}>{getUserDisplayName(match.players[1].user)}</div>
					</div>
					<div
						className={cls.pieceBox}
						style={{
							borderBottomRightRadius: spacers.small,

							background: determineBackgroundColor(match, theme, 'black'),
						}}
					>
						<img src={blackPiece} alt="black" />
					</div>
				</div>
				<div className={cls.hovered}>
					<div className={cls.hoveredBkg}>
						<div className={cls.hoveredContent} onClick={() => {}}>
							<Text size="subtitle1" className={cls.analyse}>
								Analyse Game
							</Text>
						</div>
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
		paddingRight: spacers.default,
	},
	container: {
		display: 'flex',
		flexDirection: 'column',
		position: 'relative',
		width: '15rem',
		color: theme.text.baseColor,
		...fonts.small1,
		...softBorderRadius,
		...hardFloatingShadow,
		...({
			'&:hover > $hovered': {
				display: 'block !important',
			},
		} as NestedCSSElement),
		...({
			'&:hover > $playerContainer >$playerBox': {
				background: theme.name === 'darkDefault' ? '#D833D1 !important' : '#88ABEC !important',
			},
		} as NestedCSSElement),
		...({
			'&:hover > $playerContainer >$pieceBox': {
				background: theme.name === 'darkDefault' ? '#D833D1 !important' : '#88ABEC !important',
			},
		} as NestedCSSElement),
	},
	hovered: {
		position: 'absolute',
		zIndex: 90,
		left: 0,
		top: 0,
		right: 0,
		bottom: 0,
		display: 'none',
	},
	hoveredBkg: {
		cursor: 'pointer',
		position: 'absolute',
		left: '0px',
		top: 0,
		right: 0,
		bottom: 0,
		background: theme.name === 'darkDefault' ? '#c53bceb3' : '#88abecb5',
		zIndex: 98,
		...softBorderRadius,
	},
	hoveredContent: {
		cursor: 'pointer',
		display: 'flex',
		justifyContent: 'center',
		alignContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		left: 0,
		top: 0,
		right: 0,
		bottom: 0,
		zIndex: 99,
		color: colors.universal.white,
	},
	analyse: {
		...textShadowDarkMode,
	},
	border: {
		position: 'absolute',
		height: '100%',
		width: '37px',
		left: '-28px',
		zIndex: 1,
		background:
			theme.name === 'darkDefault'
				? '#ff33a0'
				: 'linear-gradient(94.87deg, #5FD8F9 -22.01%, #BE6ED9 108.47%)',
	},
	scoreContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignContent: 'center',
		height: '100%',
		width: '100%',
		alignItems: 'center',
	},
	playerContainer: {
		display: 'flex',
		position: 'relative',
		marginLeft: '28px',
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
		// background: theme.name === 'darkDefault' ? '#3A446A' : 'grey',
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
