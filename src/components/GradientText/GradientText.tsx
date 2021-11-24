import React, { useMemo } from 'react';
import { createUseStyles, NestedCSSElement } from 'src/lib/jss';

type Props = {};

export const GradientText: React.FC<Props> = (props) => {
  const cls = useStyles();

  const isSafari = useMemo(() => /^((?!chrome|android).)*safari/i.test(navigator.userAgent), []);

  // TODO: For some reason Safari doesnt support gradients in this fashion
  //  Beed to look into a better way to do it
  return <div className={isSafari ? undefined : cls.gradient}>{props.children}</div>;
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
