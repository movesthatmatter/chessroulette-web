import React, { useMemo, useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { fonts, hardFloatingShadow, softBorderRadius } from 'src/theme';
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

type Props = {
	match:
		| TournamentOpenMatchRecord
		| TournamentUnderwayMatchRecord
		| TournamentInProgressMatchRecord;
};

export const ProgressMatch: React.FC<Props> = ({ match }) => {
	const cls = useStyles();
	const auth = useAuthentication();
	const theme = useColorTheme().theme;
	const { colors } = theme;
	const history = useHistory();
	const { path, url } = useRouteMatch();
	const [mouseOver, setMouseOver] = useState(false);

	const playMatch = () => {
		playTournamentMatch({
			tournamentId: match.tournamentId,
			matchId: match.id,
		}).map((m) => {
			console.log('path', url);
			history.push(`${url}/matches/${m.slug}`);
		});
	};

	const edgeColor = useMemo(() => {
		return match.state === 'open'
			? //Open
			  theme.name === 'darkDefault'
				? theme.colors.secondary
				: theme.colors.primary
			: //Underway
			match.state === 'underway'
			? theme.name === 'darkDefault'
				? theme.colors.positiveLight
				: theme.colors.positive
			: //In Progress
			  '#FF32A1';
	}, [match]);

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
				{match.state === 'inProgress' && <div className={cls.liveIcon} />}
				<div
					className={cls.playerContainer}
					style={{
						borderBottom: `1px solid ${colors.background}`,
					}}
					onClick={() => {
						if (auth.authenticationType === 'user' && auth.user.id === match.players[0].user.id) {
							playMatch();
						}
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
							background: edgeColor,
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
							...(mouseOver && {
								background: edgeColor,
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
							...(mouseOver && {
								background: edgeColor,
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
					onClick={() => {
						if (auth.authenticationType === 'user' && auth.user.id === match.players[1].user.id) {
							playMatch();
						}
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
							background: edgeColor,
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
							...(mouseOver && {
								background: edgeColor,
							}),
						}}
					>
						<Avatar mutunachiId={+match.players[0].user.avatarId} size={20} />
						<div>{getUserDisplayName(match.players[1].user)}</div>
					</div>
					<div
						className={cls.pieceBox}
						style={{
							borderBottomRightRadius: spacers.small,
							...(mouseOver && {
								background: edgeColor,
							}),
						}}
					>
						<img src={blackPiece} alt="black" />
					</div>
				</div>
			</div>
			<div className={cls.status}>
				<Text size="tiny1" style={{ fontWeight: 'bold', fontStyle: 'italic', color: edgeColor }}>
					{match.state === 'underway'
						? 'Waiting To Start'
						: match.state === 'inProgress'
						? 'In Progress'
						: 'Scheduled'}
				</Text>
				<Text size="tiny2" style={{ color: theme.text.baseColor }}>
					{dateformat(
						match.state === 'underway'
							? match.underwayAt
							: match.state === 'inProgress'
							? match.startedAt
							: match.scheduledAt,
						'dd mmmm h:MM TT'
					)}
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
		maxWidth: '25rem',
		minWidth: '15rem',
		...fonts.small1,
		...softBorderRadius,
		...hardFloatingShadow,
		color: theme.text.baseColor,
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
