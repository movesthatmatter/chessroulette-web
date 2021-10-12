import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { AspectRatio } from '../AspectRatio';
import { Mutunachi } from '../Mutunachi/Mutunachi';
import { getBoxShadow } from 'src/theme/util';
import hexToRgba from 'hex-to-rgba';
import cx from 'classnames';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { themes } from 'src/theme';

export type AvatarProps = {
  className?: string;
  hasBorder?: boolean;
  darkBG?: boolean;
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
 themes.lightDefault.colors.negativeLight,
 themes.lightDefault.colors.positiveLight,
 themes.lightDefault.colors.primaryLight,
 themes.lightDefault.colors.attentionLight,

  // Better to have 5 or odd number
  themes.lightDefault.colors.attentionLight,
];

const getColor = (mid: number) => bkgColors[mid % bkgColors.length];

export const Avatar: React.FC<AvatarProps> = ({
  className,
  hasBorder = false,
  darkBG = false,
  size = 32,
  monochrome = false,

  ...props
}) => {
  const cls = useStyles();

  const bkgColor =
    props.mutunachiId && !monochrome ? getColor(props.mutunachiId) : themes.lightDefault.colors.neutralLighter;
  const {theme} = useColorTheme();
  return (
    <div>
      <div
        className={cx(cls.mask, className)}
        style={{
          width: size,
          background: bkgColor,
          border: `2px solid ${darkBG ? themes.darkDefault.colors.neutralLightest : themes.lightDefault.colors.neutralLightest}`,
          ... (theme.name === 'lightDefault' && {boxShadow: getBoxShadow(0, 2, 16, 0, hexToRgba(bkgColor, 0.3))}),
        }}
      >
        <AspectRatio aspectRatio={1}>
          {props.mutunachiId ? (
            <Mutunachi mid={props.mutunachiId} className={cls.mutunachiContainer} avatar/>
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
