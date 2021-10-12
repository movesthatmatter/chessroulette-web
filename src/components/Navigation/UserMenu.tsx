import React, { useRef, useState } from 'react';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { useAuthentication } from 'src/services/Authentication';
import { CustomTheme, floatingShadow, hardBorderRadius, onlyMobile } from 'src/theme';
import cx from 'classnames';
import { useOnClickOutside } from 'src/lib/hooks/useOnClickOutside';
import { Link } from 'react-router-dom';
import { UserInfo } from 'src/modules/User/components/UserInfo';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { spacers } from 'src/theme/spacers';

type Props = {
  darkBG?: boolean;
  reversed?: boolean;
  withDropMenu?: boolean;
  linksTarget?: 'blank' | 'self';
  showPeerStatus?: boolean;
};

export const UserMenu: React.FC<Props> = ({
  darkBG = false,
  reversed = false,
  withDropMenu = false,
  linksTarget = 'self',
}) => {
  const cls = useStyles();
  const auth = useAuthentication();
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpened, setMenuOpened] = useState(false);

  useOnClickOutside(menuRef, () => {
    setMenuOpened(false);
  });

  // TODO: Maybe change in the future
  if (auth.authenticationType === 'none') {
    return null;
  }

  const labelContent = (
    <div
      className={cx(cls.container, darkBG && cls.containerDarkMode, withDropMenu && cls.asLink)}
    >
      <div
        className={cx(cls.label)}
        style={{
          flexDirection: reversed ? 'row-reverse' : 'row',
        }}
        {...(withDropMenu && {
          onClick: () => {
            setMenuOpened((prev) => !prev);
          },
        })}
      >
        <UserInfo user={auth.user} reversed={reversed} />
        {withDropMenu && (
          <>
            <div className={cls.spacer} />
            <FontAwesomeIcon icon={menuOpened ? faCaretUp : faCaretDown} className={cls.caretIcon} />
          </>
        )}
      </div>
    </div>
  );

  if (withDropMenu && auth.authenticationType === 'user') {
    return (
      <div className={cx(menuOpened && cls.menuWrapper)}>
        {labelContent}
        {menuOpened && (
          <div className={cls.menuContentWrapper} ref={menuRef}>
            <div className={cls.openedMenuLabelWrapper}>
              <div style={{ display: 'flex', flex: 1 }} />
              {labelContent}
            </div>
            <div className={cls.menuContent}>
              <div className={cls.linkWrapper}>
                <Link
                  to="/user/details"
                  className={cls.link}
                  {...(linksTarget === 'blank' && { target: '_blank' })}
                >
                  My Details
                </Link>
              </div>
              <div className={cls.linkWrapper}>
                <Link
                  to="/user/games"
                  className={cls.link}
                  {...(linksTarget === 'blank' && { target: '_blank' })}
                >
                  My Games
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return labelContent;
};

const useStyles = createUseStyles<CustomTheme>(theme => ({
  container: {
    display: 'flex',
    flex: 1,
  },
  containerDarkMode: {
    color: theme.colors.white,
  },
  asLink: {
    cursor: 'pointer',
  },
  box: {
    display: 'flex',
    flex: 1,
  },
  menuWrapper: {
    position: 'relative',
  },
  menuContentWrapper: {
    ...(theme.name === 'darkDefault' && {
      ...onlyMobile({
        boxShadow:'0 10px 20px rgb(0 0 0 / 50%) !important'
      })
    }),
    position: 'absolute',
    top: '-12px',
    paddingTop: '12px',
    right: '-12px',
    paddingRight: '12px',
    paddingLeft: '12px',

    width: '200px',

    zIndex: 999,
    background: theme.colors.white,
    ...theme.floatingShadow,
    ...hardBorderRadius,
  },
  openedMenuLabelWrapper: {
    paddingBottom: '16px',
    borderBottom: `1px solid ${theme.colors.neutralLighter}`,
    display: 'flex',
  },
  menuContent: {
    paddingTop: '16px',
    ...onlyMobile({
      paddingBottom:'16px'
    })
  },
  label: {
    display: 'flex',
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',

    '&:focus': {
      ...makeImportant({
        boxShadow: 'none',
      }),
    },
  },

  linkWrapper: {
    padding: '8px 20px 16px',
    alignSelf: 'center',
    textAlign: 'right',
  },
  link: {
    textTransform: 'capitalize',
    textDecoration: 'none',
    color: theme.colors.neutralDarkest,
    fontFamily: 'Lato, Open Sans, sans serif',
    fontSize: '16px',
    textAlign: 'right',

    '&:hover': {
     ...theme.links.hover
    },
  },
  caretIcon: {
    color: theme.colors.neutralDarkest,
  },
  spacer: {
    paddingRight: spacers.default,
  },
}));
