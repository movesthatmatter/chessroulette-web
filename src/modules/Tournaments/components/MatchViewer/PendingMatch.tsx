import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { fonts, hardFloatingShadow, softBorderRadius } from 'src/theme';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { spacers } from 'src/theme/spacers';
import whitePiece from '../../assets/white_piece.svg';
import blackPiece from '../../assets/black_piece.svg';

type Props = {};

export const PendingMatch: React.FC<Props> = ({}) => {
	const cls = useStyles();
	const theme = useColorTheme().theme;
	const { colors } = theme;

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
					TBD
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
					className={cls.playerBox}
					style={{
						borderBottomLeftRadius: spacers.small,
					}}
				>
					TBD
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
		...hardFloatingShadow,
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
}));
