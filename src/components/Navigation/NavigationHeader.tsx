import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Logo } from 'src/components/Logo';

type Props = {
  logoAsLink?: boolean;
};

export const NavigationHeader: React.FC<Props> = ({
  logoAsLink = true,
}) => {
  const cls = useStyles();

  return (
    <div className={cls.top}>
      <div className={cls.topMain}>
        <Logo asLink={logoAsLink}/>
      </div>
    </div>
  );
};

const topHeightPx = 60;

const useStyles = createUseStyles({
  container: {},
  top: {
    height: `${topHeightPx}px`,
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'space-between',
  },
  topMain: {
    flex: 1,
  },
  topRight: {
    justifySelf: 'flex-end',
  },
  main: {
    width: '100%',
    height: `calc(100% - ${topHeightPx}px)`,
  },
});
