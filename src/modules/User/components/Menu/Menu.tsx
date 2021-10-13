import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { LogoutButton } from 'src/services/Authentication/widgets';
import { Link } from 'react-router-dom';
import { spacers } from 'src/theme/spacers';

type Section = {
  route: string;
  display: string;
};

type Props = {
  current: string;
  sections: Section[];
  containerClassName: string;
  linkClassName: string;
  activeLinkClassName: string;
};

export const Menu: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <div className={cx(cls.container, props.containerClassName)}>
      <div className={cls.menuContent}>
        {props.sections.map(({ route, display }) => (
          <Link
            key={route}
            to={`/user/${route}`}
            className={cx(props.linkClassName, {
              [props.activeLinkClassName]: props.current === route,
            })}
          >
            {display}
          </Link>
        ))}
        <div className={cls.logoutButtonWrapper}>
          <LogoutButton clear full type="primary" className={cls.logoutButton} />
        </div>
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
  menuContent: {
    flex: 1,
  },
  logoutButtonWrapper: {
    paddingTop: spacers.largest,
    paddingRight: '16px',
  },
  logoutButton: {
    marginBottom: 0,
  },
});
