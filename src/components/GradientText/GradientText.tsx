import React, { useMemo } from 'react';
import { createUseStyles, NestedCSSElement } from 'src/lib/jss';

type Props = {
  gradientCSSProp?: string;
};

export const GradientText: React.FC<Props> = ({ gradientCSSProp, children }) => {
  const cls = useStyles();

  const isSafari = useMemo(() => /^((?!chrome|android).)*safari/i.test(navigator.userAgent), []);

  const { className, style } = useMemo(() => {
    if (isSafari) {
      return {
        className: undefined,
        style: undefined,
      };
    }

    return {
      className: cls.gradient,
      style: {
        backgroundImage: gradientCSSProp,
      },
    };
  }, [isSafari, cls, gradientCSSProp]);

  // TODO: For some reason Safari doesnt support gradients in this fashion
  // Need to look into a better way to do it
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

const useStyles = createUseStyles((theme) => ({
  gradient: {
    backgroundImage: `linear-gradient(45deg, ${
      theme.name === 'darkDefault' ? theme.colors.positiveLight : theme.colors.primary
    } 0, #fff 150%)`,
    ...({
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
    } as NestedCSSElement),
  },
}));