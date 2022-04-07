import React from 'react';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { colors } from './colors';
import { useColorTheme } from './hooks/useColorTheme';
import { spacers } from './spacers';

const ColoredCircles: React.FC<{}> = (props) => {
	const cls = useStyles();
	const theme = useColorTheme().theme;

	return (
		<div className={cls.container}>
			{Object.keys(colors.light).map((color) => (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '10px',
						justifyContent: 'center',
					}}
				>
					<div
						className={cls.coloredSquare}
						style={{
							backgroundColor: theme.colors[color as keyof typeof colors.light],
						}}
					/>
					<Text size="small1">{color}</Text>
				</div>
			))}
		</div>
	);
};

const useStyles = createUseStyles((theme) => ({
	coloredSquare: {
		width: '30px',
		height: '30px',
		borderRadius: '50%',
	},
	container: {
		display: 'flex',
		flexDirection: 'column',
		gap: spacers.default,
		flexWrap: 'wrap',
		width: '100vw',
	},
}));

export default {
	component: ColoredCircles,
	title: 'Theme Preview',
};

export const PreviewCircles = () => <ColoredCircles />;
