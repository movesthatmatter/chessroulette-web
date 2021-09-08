import React, { useRef, useState } from 'react';
import { Box } from 'grommet';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { selectAuthentication } from 'src/services/Authentication';
import { colors, floatingShadow, hardBorderRadius, text } from 'src/theme';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { PeerInfo } from 'src/providers/PeerProvider';
import { useOnClickOutside } from 'src/lib/hooks/useOnClickOutside';
import { Link } from 'react-router-dom';
import { useMyPeer } from 'src/providers/PeerProvider/hooks';

type Props = {
  darkMode?: boolean;
  reversed?: boolean;
  withDropMenu?: boolean;
  linksTarget?: 'blank' | 'self';
  showPeerStatus?: boolean;
};

export const UserMenu: React.FC<Props> = ({
  darkMode = false,
  reversed = false,
  withDropMenu = false,
  showPeerStatus = false,
  linksTarget = 'self',
}) => {
  const cls = useStyles();
  const auth = useSelector(selectAuthentication);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpened, setMenuOpened] = useState(false);
  const myPeer = useMyPeer();

  useOnClickOutside(menuRef, () => {
    setMenuOpened(false);
  });

  // TODO: Maybe change in the future
  if (auth.authenticationType === 'none' || !myPeer) {
    return null;
  }

  const labelContent = (
    <Box fill className={cx(darkMode && cls.containerDarkMode)} direction="row">
      <Box
        fill
        direction={reversed ? 'row-reverse' : 'row'}
        className={cls.label}
        {...(withDropMenu && {
          onClick: () => {
            setMenuOpened((prev) => !prev);
          },
        })}
      >
        <PeerInfo peer={myPeer} reversed showPeerStatus={showPeerStatus} />
      </Box>
    </Box>
  );

  if (withDropMenu && auth.authenticationType === 'user') {
    return (
      <div className={cx(menuOpened && cls.menuWrapper)}>
        {labelContent}
        {menuOpened && (
          <div className={cls.menuContentWrapper} ref={menuRef}>
            <div className={cls.openedMenuLabelWrapper}>{labelContent}</div>
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

const useStyles = createUseStyles({
  containerDarkMode: {
    color: colors.white,
  },
  menuWrapper: {
    position: 'relative',
  },
  menuContentWrapper: {
    position: 'absolute',
    top: '-12px',
    paddingTop: '12px',
    right: '-12px',
    paddingRight: '12px',
    paddingLeft: '12px',

    width: '200px',

    zIndex: 999,
    background: colors.white,
    ...floatingShadow,
    ...hardBorderRadius,
  },
  openedMenuLabelWrapper: {
    paddingBottom: '16px',
    borderBottom: `1px solid ${colors.neutralLighter}`,
  },
  menuContent: {
    paddingTop: '16px',
  },
  label: {
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
    color: colors.neutralDarkest,
    fontFamily: 'Lato, Open Sans, sans serif',
    fontSize: '16px',
    textAlign: 'right',

    '&:hover': {
      borderBottom: `3px solid ${text.primaryColor}`,
      color: text.primaryColor,
    },
  },
});
