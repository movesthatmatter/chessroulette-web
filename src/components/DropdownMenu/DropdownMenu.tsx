import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef } from 'react';
import { createUseStyles, CSSProperties, makeImportant } from 'src/lib/jss';
import { colors, floatingShadow, fonts, softOutline, softBorderRadius, text } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import cx from 'classnames';

type Props = {
  title: string | React.ReactNode;
  items: (
    | (React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> & {
        disabled?: boolean;
      })
    | (() => React.ReactNode)
  )[];
  withCaret?: boolean;
  droplistSide?: 'right' | 'left';
  droplistClassName?: string;
};

export const DropdownMenu: React.FC<Props> = ({
  title,
  items,
  withCaret,
  droplistSide = 'left',
  droplistClassName,
}) => {
  const cls = useStyles();
  const menuRef = useRef<HTMLDivElement>(null);

  const hasItems = items.length > 0;

  return (
    <div className={cx(cls.linkWrapper, hasItems && cls.linkWrapperWithDropMenu)}>
      <div className={cx(cls.link, cls.linkWithDropdown)}>
        {title}
        {withCaret && (
          <>
            <div className={cls.spacer} />
            <FontAwesomeIcon icon={faCaretDown} className={cls.caretIcon} />
          </>
        )}
      </div>

      <div
        className={cx(cls.menuContentWrapper, droplistClassName)}
        style={{
          ...(droplistSide === 'left' && {
            left: 'auto',
            right: `-${spacers.small}`,
          }),
        }}
        ref={menuRef}
      >
        <div className={cls.menuContent}>
          {items.map((itemOrRenderProps) => {
            if (typeof itemOrRenderProps === 'function') {
              return itemOrRenderProps();
            }

            const { onClick, ...item } = itemOrRenderProps;

            return (
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
            );
          })}
        </div>
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
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
    color: colors.neutralDarkest,
    fontFamily: 'Lato, Open Sans, sans serif',
    fontSize: spacers.default,
    textAlign: 'center',
    cursor: 'pointer',

    '&:hover': {
      borderBottom: `3px solid ${text.primaryColor}`,
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
    color: colors.neutralDarkest,
    fontFamily: 'Lato, Open Sans, sans serif',
    fontSize: spacers.default,
    cursor: 'pointer',
    paddingBottom: spacers.small,
    paddingTop: spacers.small,

    '&:hover': {
      fontWeight: 'bold',
      color: text.primaryColor,
    },
  },
  disabledNestedLink: {
    cursor: 'auto',
    color: colors.neutralDarker,
    '&:hover': {
      fontWeight: 'normal',
      color: text.disabledColor,
    },
  },
  spacer: {
    paddingRight: spacers.small,
  },
  caretIcon: {
    color: colors.neutralDarkest,
  },

  menuWrapper: {
    position: 'relative',
  },
  menuContentWrapper: {
    display: 'none',
    position: 'absolute',
    minWidth: '100%',
    zIndex: 8,
    background: colors.white,
    ...floatingShadow,
    ...softBorderRadius,
    ...softOutline,

    top: `-${spacers.small}`,
    left: `-${spacers.small}`,
    paddingTop: '20px',
    paddingLeft: spacers.default,
    paddingRight: spacers.default,
  },
  openedMenuLabelWrapper: {
    paddingBottom: spacers.default,
    borderBottom: `1px solid ${colors.neutralLighter}`,
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
});
