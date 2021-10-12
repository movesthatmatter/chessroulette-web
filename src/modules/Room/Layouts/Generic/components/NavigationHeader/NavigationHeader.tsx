import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Logo } from 'src/components/Logo';
import { onlyMobile, onlySmallMobile } from 'src/theme';
import { UserMenu } from 'src/components/Navigation/UserMenu';

type Props = {
  logoAsLink?: boolean;
  darkBG?: boolean,
};

export const NavigationHeader: React.FC<Props> = ({ logoAsLink = true, darkBG = false }) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      <Logo asLink={logoAsLink} darkBG={darkBG} />
      <UserMenu darkBG={darkBG} reversed />
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',

    ...onlyMobile({
      height: 'auto',
      padding: '12px',
    }),

    ...onlySmallMobile({
      padding: '8px',
    }),
  },
});
