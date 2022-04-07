import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { fonts, hardFloatingShadow, softBorderRadius } from 'src/theme';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { spacers } from 'src/theme/spacers';
import whitePiece from './assets/white_piece.svg';
import blackPiece from './assets/black_piece.svg';
import {
	TournamentUnderwayMatchRecord,
	TournamentInProgressMatchRecord,
} from 'chessroulette-io/dist/resourceCollections/tournaments/records';
import { useAuthentication } from 'src/services/Authentication';
import cx from 'classnames';
import { useEnterRoom } from 'src/modules/Room/hooks/useEnterRoom';
import { playTournamentMatch } from '../../resources';
import { getUserDisplayNameClean } from 'src/modules/User';
import { colors } from 'src/theme/colors';
import { ChessGameColor } from 'chessroulette-io';
import { Text } from 'src/components/Text';
import { Play } from 'react-iconly';

type Props = {
	match: TournamentUnderwayMatchRecord | TournamentInProgressMatchRecord;
};

export const JoinableMatch: React.FC<Props> = ({ match }) => {
	const cls = useStyles();
	const theme = useColorTheme().theme;
	const { colors } = theme;
	const auth = useAuthentication();
	const enterRoom = useEnterRoom();

	const joinMatch = () => {
		playTournamentMatch({
			tournamentId: match.tournamentId,
			matchId: match.id,
		}).map(enterRoom);
	};

	function getBackgroundForPlayer(player: ChessGameColor): string {
		return match.state === 'inProgress'
			? theme.name === 'lightDefault'
				? theme.colors.primaryHover
				: theme.colors.secondaryDark
			: 'linear-gradient(93.25deg, #43D1BE 57.12%, #2FB1A0 104.88%)';
	}

	const player1Class =
		auth.authenticationType === 'user' && auth.user.id === match.players[0].user.id
			? cls.playable
			: cls.nonPlayable;
	const player2Class =
		auth.authenticationType === 'user' && auth.user.id === match.players[1].user.id
			? cls.playable
			: cls.nonPlayable;

	return (
		<div className={cls.container}>
			{match.state === 'inProgress' && <div className={cls.liveIcon} />}
			{match.state === 'inProgress' && (
				<div className={cls.liveText}>
					{`LIVE`.split('').map((c) => (
						<Text size="small3">{c}</Text>
					))}
				</div>
			)}
			{match.state === 'underway' && (
				<div
					style={{
						position: 'absolute',
						top:
							auth.authenticationType === 'user' && auth.user.id === match.players[0].user.id
								? '10%'
								: '54%',
						right: '-24px',
					}}
				>
					<Play set="bold" primaryColor="#43D1BE" />
				</div>
			)}
			<div
				className={cx(cls.playerContainer, player1Class)}
				style={{
					borderBottom: `1px solid ${colors.background}`,
					borderTopLeftRadius: spacers.small,
					borderTopRightRadius: spacers.small,
					background: getBackgroundForPlayer('white'),
				}}
				onClick={() => {
					if (auth.authenticationType === 'user' && auth.user.id === match.players[0].user.id) {
						joinMatch();
					}
				}}
			>
				<div className={cls.playerBox}>{getUserDisplayNameClean(match.players[0].user)}</div>
				<div className={cls.scoreBox}>
					<img src={whitePiece} alt="white" />
				</div>
			</div>
			<div
				className={cx(cls.playerContainer, player2Class)}
				style={{
					borderTop: `1px solid ${colors.background}`,
					borderBottomLeftRadius: spacers.small,
					borderBottomRightRadius: spacers.small,
					background: getBackgroundForPlayer('black'),
				}}
				onClick={() => {
					if (auth.authenticationType === 'user' && auth.user.id === match.players[1].user.id) {
						joinMatch();
					}
				}}
			>
				<div className={cls.playerBox}>{getUserDisplayNameClean(match.players[1].user)}</div>
				<div className={cls.pieceBox}>
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
		...fonts.small1,
		...softBorderRadius,
		...hardFloatingShadow,
		color: colors.universal.white,
	},
	liveIcon: {
		width: '15px',
		height: '15px',
		borderRadius: '50%',
		backgroundColor: '#FF33A1',
		border: `3px solid ${theme.colors.background}`,
		position: 'absolute',
		top: '-10px',
		right: '-10px',
		zIndex: 50,
	},
	liveText: {
		flex: 1,
		flexDirection: 'column',
		color: '#FF32A1',
		display: 'flex',
		position: 'absolute',
		right: '-13px',
		top: '10px',
		fontWeight: 900,
	},
	playable: {
		fontWeight: 'bold',
	},
	nonPlayable: {},
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
