import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef } from 'react';
import { createUseStyles, CSSProperties, makeImportant } from 'src/lib/jss';
import { floatingShadow, fonts, softOutline, softBorderRadius, CustomTheme } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import cx from 'classnames';

type Props = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> & {
  title: string;
  withDropMenu?: {
    items: (React.DetailedHTMLProps<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    > & {
      disabled?: boolean;
    })[];
  };
};

export const NavigationLink: React.FC<Props> = ({ title, withDropMenu, ...linkProps }) => {
  const cls = useStyles();
  const menuRef = useRef<HTMLDivElement>(null);

  return (
    <div className={cx(cls.linkWrapper, withDropMenu && cls.linkWrapperWithDropMenu)}>
      <a
        className={cx(cls.link, withDropMenu && cls.linkWithDropdown)}
        target="_blank"
        {...linkProps}
      >
        {title}
        {withDropMenu && (
          <>
            <div className={cls.spacer} />
            <FontAwesomeIcon icon={faCaretDown} className={cls.caretIcon} />
          </>
        )}
      </a>
      {withDropMenu && (
        <div className={cls.menuContentWrapper} ref={menuRef}>
          <div className={cls.menuContent}>
            {withDropMenu.items.map(({ onClick, ...item }) => (
              <div className={cls.linkWrapper} key={item.title}>
                <a
                  className={cx(cls.nestedLink, item.disabled && cls.disabledNestedLink)}
                  onClick={(e) => {
                    if (!item.disabled && onClick) {
                      onClick(e);
                    }
                  }}
                  {...item}
                >
                  {item.title}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const useStyles = createUseStyles<CustomTheme>(theme => ({
  linkWrapper: {
    position: 'relative',
    display: 'inline-block',
  },
  linkWrapperWithDropMenu: {
    '&:hover': {
      ...({
        '& $menuContentWrapper': {
          display: 'block',
        },
      } as CSSProperties),
    },
  },
  link: {
    ...fonts.small1,
    textDecoration: 'none',
    color: theme.colors.neutralDarkest,
    fontFamily: 'Lato, Open Sans, sans serif',
    fontSize: spacers.default,
    textAlign: 'center',
    cursor: 'pointer',

    '&:hover': {
      borderBottom: `3px solid ${theme.text.primaryColor}`,
    },

    position: 'relative',
    zIndex: 9,
  },
  linkWithDropdown: {
    display: 'flex',
    flex: 0,
    flexFlow: 'wrap',
    flexBasis: 0,

    '&:hover': {
      borderBottom: 0,
    },
  },
  nestedLink: {
    ...fonts.small1,
    display: 'block',
    color: theme.colors.neutralDarkest,
    fontFamily: 'Lato, Open Sans, sans serif',
    fontSize: spacers.default,
    cursor: 'pointer',
    paddingBottom: spacers.small,
    paddingTop: spacers.small,

    '&:hover': {
      fontWeight: 'bold',
      color: theme.text.primaryColor,
    },
  },
  disabledNestedLink: {
    cursor: 'auto',
    color: theme.colors.neutralDarker,
    '&:hover': {
      fontWeight: 'normal',
      color: theme.text.disabledColor,
    },
  },
  spacer: {
    paddingRight: spacers.small,
  },
  caretIcon: {
    color: theme.colors.neutralDarkest,
  },

  menuWrapper: {
    position: 'relative',
  },
  menuContentWrapper: {
    display: 'none',
    position: 'absolute',
    minWidth: '100%',
    zIndex: 8,
    background: theme.colors.white,
    ...floatingShadow,
    ...softBorderRadius,
    ...softOutline,

    top: `-${spacers.small}`,
    left: `-${spacers.default}`,
    paddingTop: '20px',
    paddingLeft: spacers.default,
    paddingRight: spacers.default,
  },
  openedMenuLabelWrapper: {
    paddingBottom: spacers.default,
    borderBottom: `1px solid ${theme.colors.neutralLighter}`,
    display: 'flex',
  },
  menuContent: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: spacers.default,
    paddingBottom: spacers.small,
  },
  label: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',

    '&:focus': {
      ...makeImportant({
        boxShadow: 'none',
      }),
    },
  },
}));
