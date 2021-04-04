import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { LogoutButton } from 'src/services/Authentication/widgets';
import { Link } from 'react-router-dom';

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
            to={`/user/${route}`}
            className={cx(props.linkClassName, {
              [props.activeLinkClassName]: props.current === route,
            })}
          >
            {display}
          </Link>
        ))}
      </div>
      <div className={cls.logoutButtonWrapper}>
        <LogoutButton clear full className={cls.logoutButton} />
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
    paddingRight: '16px',
  },
  logoutButton: {
    marginBottom: 0,
  },
});
