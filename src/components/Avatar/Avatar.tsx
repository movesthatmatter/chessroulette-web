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
  // size?: string | number;
  size?: number;
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

const bkgBorderColors = [
  themes.lightDefault.colors.negativeDarker,
  themes.lightDefault.colors.positiveDarker,
  themes.lightDefault.colors.primaryDarker,
  themes.lightDefault.colors.attentionDarker,

  // Better to have 5 or odd number
  themes.lightDefault.colors.attentionDarker,
];

const getColor = (mid: number) => bkgColors[mid % bkgColors.length];
const getBorderColor = (mid: number) => bkgBorderColors[mid % bkgColors.length];

const borderSizePx = 3;

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
    props.mutunachiId && !monochrome
      ? getColor(props.mutunachiId)
      : themes.lightDefault.colors.neutralLighter;
  const borderColor =
    props.mutunachiId && !monochrome
      ? getBorderColor(props.mutunachiId)
      : themes.darkDefault.colors.primary;

  const { theme } = useColorTheme();

  return (
    <div>
      <div
        style={{
          width: size + borderSizePx * 2,
          height: size + borderSizePx * 2,
          display: 'flex',
          position: 'relative',
        }}
        className={cx(className)}
      >
        <div
          className={cls.mask}
          style={{
            background: bkgColor,
            ...(theme.name === 'lightDefault' && {
              boxShadow: getBoxShadow(0, 2, 16, 0, hexToRgba(bkgColor, 0.3)),
            }),
          }}
        >
          <AspectRatio aspectRatio={1}>
            {props.mutunachiId ? (
              <Mutunachi mid={props.mutunachiId} className={cls.mutunachiContainer} avatar />
            ) : (
              <img src={props.imageUrl} className={cls.imageContainer} />
            )}
          </AspectRatio>
        </div>
        <div
          className={cls.borderBkg}
          style={{
            background: `linear-gradient(45deg, ${borderColor} 0, #fff 120%)`,
          }}
        />
      </div>
    </div>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {},
  mask: {
    overflow: 'hidden',
    position: 'relative',
    borderRadius: '50%',
    zIndex: 1,
    boxSizing: 'border-box',
    margin: `${borderSizePx}px`,
    width: '100%',
  },
  mutunachiContainer: {
    width: '70%',
    transform: 'translateX(20%) translateY(15%)',
  },
  imageContainer: {
    width: '100%',
  },
  borderBkg: {
    borderRadius: '100%',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    position: 'absolute',
    // background: `linear-gradient(45deg, ${theme.colors.primary} 0, #fff 150%)`,
  },
}));
