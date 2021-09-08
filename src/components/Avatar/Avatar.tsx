import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { AvatarProps as GAvatarProps } from 'grommet';
import { colors } from 'src/theme';
import { AspectRatio } from '../AspectRatio';
import { Mutunachi } from '../Mutunachi/Mutunachi';
import { getBoxShadow } from 'src/theme/util';
import hexToRgba from 'hex-to-rgba';
import cx from 'classnames';

export type AvatarProps = GAvatarProps & {
  className?: string;
  hasBorder?: boolean;
  darkMode?: boolean;
  size?: string | number;
  monochrome?: boolean;
} & (
    | {
        mutunachiId: number;
        imageUrl?: undefined;
      }
    | {
        mutunachiId?: undefined;
        imageUrl: string;
      }
  );

const bkgColors = [
  colors.negativeLight,
  colors.positiveLight,
  colors.primaryLight,
  colors.attentionLight,

  // Better to have 5 or odd number
  colors.attentionLight,
];

const getColor = (mid: number) => bkgColors[mid % bkgColors.length];

export const Avatar: React.FC<AvatarProps> = ({
  className,
  hasBorder = false,
  darkMode = false,
  size = 32,
  monochrome = false,

  ...props
}) => {
  const cls = useStyles();

  const bkgColor =
    props.mutunachiId && !monochrome ? getColor(props.mutunachiId) : colors.neutralLighter;

  return (
    <div>
      <div
        className={cx(cls.mask, className)}
        style={{
          width: size,
          background: bkgColor,
          border: `2px solid ${darkMode ? colors.neutralLightest : colors.neutralLightest}`,
          boxShadow: getBoxShadow(0, 2, 16, 0, hexToRgba(bkgColor, 0.3)),
        }}
      >
        <AspectRatio aspectRatio={1}>
          {props.mutunachiId ? (
            <Mutunachi mid={props.mutunachiId} className={cls.mutunachiContainer} />
          ) : (
            <img src={props.imageUrl} className={cls.imageContainer} />
          )}
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
  imageContainer: {
    width: '100%',
    // width: '70%',
    // transform: 'translateX(20%) translateY(15%)',
  },
});
