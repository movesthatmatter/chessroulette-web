import React from 'react';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import Loader, {LoaderType} from 'react-loaders';
import { AspectRatio } from 'src/components/AspectRatio';
import { CustomTheme } from 'src/theme';
import cx from 'classnames';

type Props = {
  loader?: LoaderType,
  aspectRatio?: number | {width: number; height: number};
  classname? :string;
};

export const LoaderPlaceholder: React.FC<Props> = ({
  loader = 'ball-pulse',
  aspectRatio,
  classname
}) => {
  const cls = useStyles();

  return (
    <AspectRatio aspectRatio={aspectRatio} className={cx(cls.loaderContainer, classname)} contentClassname={cls.contentPositioning}>
      <Loader type={loader} active innerClassName={cls.loader}/>
    </AspectRatio>
  )
};

const useStyles = createUseStyles<CustomTheme>(theme => ({
  loaderContainer: {
    backgroundColor: theme.depthBackground.backgroundColor,
    display:'flex',
    justifyContent: 'center',
    alignContent: 'center',
    // height: '100%',
    width:'100%'
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    ...({
      '& > div': {
        backgroundColor: theme.colors.primary,
      },
    } as CSSProperties),
  },
  contentPositioning: {
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  }
}));