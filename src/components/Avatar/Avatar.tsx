import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { AvatarProps as GAvatarProps } from 'grommet';
import { colors } from 'src/theme';
import { AspectRatio } from '../AspectRatio';
import { Mutunachi } from '../Mutunachi/Mutunachi';

type Props = GAvatarProps & {
  className?: string;
  hasBorder?: boolean;
  darkMode?: boolean;
  size?: string | number;

  // TODO: Make it a union tag when we support profile pics
  mutunachiId: number;
};

const bkgColors = [
  colors.negativeLight,
  colors.positiveLight,
  colors.primaryLight,
  colors.attentionLight,

  // Better to have 5 or odd number
  colors.attentionLight,
];

const getColor = (mid: number) => bkgColors[mid % bkgColors.length];

export const Avatar: React.FC<Props> = ({
  className,
  hasBorder = false,
  darkMode = false,
  size = 32,

  ...props
}) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      <div
        className={cls.mask}
        style={{
          width: size,
          background: getColor(props.mutunachiId),
          border: `1px solid ${darkMode ? colors.neutralLightest : colors.neutralLightest}`,
        }}
      >
        <AspectRatio aspectRatio={1}>
          <Mutunachi mid={props.mutunachiId} className={cls.mutunachiContainer} />
        </AspectRatio>
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
  mask: {
    overflow: 'hidden',
    position: 'relative',
    borderRadius: '50%',
    zIndex: 1,
  },
  mutunachiContainer: {
    width: '70%',
    transform: 'translateX(20%) translateY(15%)',
  },
});
