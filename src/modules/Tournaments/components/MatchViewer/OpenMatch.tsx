import React, { useMemo, useState } from 'react';
import { createUseStyles, makeImportant, NestedCSSElement } from 'src/lib/jss';
import { fonts, hardFloatingShadow, softBorderRadius, textShadowDarkMode } from 'src/theme';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { spacers } from 'src/theme/spacers';
import whitePiece from '../../assets/white_piece.svg';
import blackPiece from '../../assets/black_piece.svg';
import {
	TournamentInProgressMatchRecord,
	TournamentOpenMatchRecord,
	TournamentUnderwayMatchRecord,
} from 'chessroulette-io/dist/resourceCollections/tournaments/records';
import { getUserDisplayName } from 'src/modules/User';
import { useAuthentication } from 'src/services/Authentication';
import { playTournamentMatch } from '../../resources';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Text } from 'src/components/Text';
import dateformat from 'dateformat';
import cx from 'classnames';
import { Avatar } from 'src/components/Avatar';
import { colors } from 'src/theme/colors';

type Props = {
	match: TournamentOpenMatchRecord;
};

export const OpenMatch: React.FC<Props> = ({ match }) => {
	const cls = useStyles();
	const auth = useAuthentication();
	const theme = useColorTheme().theme;
	const { colors } = theme;
	const history = useHistory();
	const { path, url } = useRouteMatch();

	const player1Class =
		auth.authenticationType === 'user' && auth.user.id === match.players[0].user.id
			? cls.playable
			: cls.nonPlayable;
	const player2Class =
		auth.authenticationType === 'user' && auth.user.id === match.players[1].user.id
			? cls.playable
			: cls.nonPlayable;

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
							background:
								theme.name === 'darkDefault' ? theme.colors.secondary : theme.colors.primary,
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
						}}
					>
						<Avatar mutunachiId={+match.players[0].user.avatarId} size={20} />
						<div style={{ maxWidth: '7rem' }}>{getUserDisplayName(match.players[0].user)}</div>
					</div>
					<div
						className={cls.pieceBox}
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
						className={cls.border}
						style={{
							borderBottomLeftRadius: spacers.small,
							background:
								theme.name === 'darkDefault' ? theme.colors.secondary : theme.colors.primary,
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
						}}
					>
						<Avatar mutunachiId={+match.players[0].user.avatarId} size={20} />
						<div style={{ maxWidth: '7rem' }}>{getUserDisplayName(match.players[1].user)}</div>
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
				<div className={cls.hovered}>
					<div className={cls.hoveredBkg}>
						<div className={cls.hoveredContent} onClick={() => {}}>
							<Text size="title2" className={cls.hoveredText}>
								View Details
							</Text>
						</div>
					</div>
				</div>
			</div>
			<div className={cls.status}>
				<Text
					size="tiny1"
					style={{
						fontWeight: 'bold',
						fontStyle: 'italic',
						color: theme.name === 'darkDefault' ? theme.colors.secondary : theme.colors.primary,
					}}
				>
					'Scheduled'
				</Text>
				<Text size="tiny2" style={{ color: theme.text.baseColor }}>
					{dateformat(match.scheduledAt, 'dd mmmm h:MM TT')}
				</Text>
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
		width: '15rem',
		...fonts.small1,
		...softBorderRadius,
		...hardFloatingShadow,
		color: theme.text.baseColor,
		...({
			'&:hover > $hovered': {
				display: 'block !important',
			},
		} as NestedCSSElement),
		...({
			'&:hover > $playerContainer >$playerBox': {
				...makeImportant({
					background: theme.name === 'darkDefault' ? theme.colors.secondary : theme.colors.primary,
				}),
			},
		} as NestedCSSElement),
		...({
			'&:hover > $playerContainer >$pieceBox': {
				...makeImportant({
					background: theme.name === 'darkDefault' ? theme.colors.secondary : theme.colors.primary,
				}),
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
		left: '-6px',
		top: 0,
		right: 0,
		bottom: 0,
		background: theme.name === 'darkDefault' ? '#8354e9b5' : '#7645ffb5',
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
	hoveredText: {
		...textShadowDarkMode,
	},
	liveIcon: {
		width: '15px',
		height: '15px',
		borderRadius: '50%',
		backgroundColor: '#FF33A1',
		border: `4px solid ${theme.colors.background}`,
		position: 'absolute',
		top: '-10px',
		right: '-10px',
		zIndex: 50,
	},
	border: {
		position: 'absolute',
		height: '100%',
		width: '1rem',
		left: '-6px',
		zIndex: 1,
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
		background: theme.colors.neutralLight,
		gap: spacers.small,
		alignItems: 'center',
	},
	pieceBox: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		alignContent: 'center',
		padding: spacers.small,
		paddingLeft: spacers.small,
		paddingRight: spacers.small,
		background: theme.colors.neutralLight,
	},
	playable: {},
	nonPlayable: {},
	status: {
		marginTop: spacers.smaller,
		display: 'flex',
		gap: spacers.default,
	},
}));
