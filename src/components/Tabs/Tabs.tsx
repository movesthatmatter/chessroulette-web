import React, { useState } from 'react';
import { Text } from 'src/components/Text';
import { createUseStyles, makeImportant, NestedCSSElement } from 'src/lib/jss';
import { CustomTheme, fonts } from 'src/theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { spacers } from 'src/theme/spacers';
import { noop } from 'src/lib/util';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import cx from 'classnames';
import { IconProps as IconlyIconProps } from 'react-iconly';
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { Icon as GIcon } from 'grommet-icons';
import { IconlyIcon } from '../Button/IconButton/components/IconlyIcon';
import { sizers } from 'src/theme/sizers';

type IconProp =
  | {
      iconType: 'fontAwesome';
      icon: FontAwesomeIconProps['icon'];
    }
  | {
      iconType: 'grommet';
      icon: GIcon;
    }
  | {
      iconType: 'iconly';
      icon: React.FC<IconlyIconProps>;
    };

type TabProps = {
  title: string;
  iconSize?: 'small' | 'default' | 'large';
  content: string | React.ReactNode;
} & IconProp;

type TabsProps = {
  tabs: TabProps[];
  currentTabIndex: number;
  onTabChanged: (nextIndex: number) => void;
  renderTabRightEndComponent?: (p: { tabIndex: number }) => React.ReactNode;
  selectedTabButtonClassName?: string;
  containerClassName?: string;
  headerClassName?: string;
  tabButtonClassName?: string;
  defaultColor?: string;
  selectedColor?: string;
};

const IconSizeInPxByName = {
  small: sizers.get(0.75),
  default: sizers.get(1.25),
  large: sizers.get(1.5),
} as const;

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  onTabChanged = noop,
  currentTabIndex = 0,
  renderTabRightEndComponent,
  selectedTabButtonClassName,
  containerClassName,
  headerClassName,
  tabButtonClassName,
  ...props
}) => {
  const cls = useStyles();
  const { theme } = useColorTheme();
  const colors = theme.colors;
  const selectedTabClass = selectedTabButtonClassName || '';

  function getIcon(tab: TabProps, index: number): React.ReactNode {
    if (!tab.icon) return null;
    if (tab.iconType === 'grommet') {
      const { icon: Icon } = tab;
      return <Icon />;
    }
    if (tab.iconType === 'fontAwesome') {
      return (
        <FontAwesomeIcon
          icon={tab.icon}
          className={cls.tabButtonIcon}
          size="lg"
          color={
            currentTabIndex === index
              ? props.selectedColor || colors.primary
              : props.defaultColor || colors.neutralDark
          }
        />
      );
    }
    const { icon: Icon } = tab;
    return (
      <IconlyIcon
        Icon={tab.icon}
        set="bold"
        primaryColor={
          currentTabIndex === index
            ? props.selectedColor || colors.primary
            : props.defaultColor || colors.neutralDark
        }
        sizeInPx={tab.iconSize ? IconSizeInPxByName[tab.iconSize] : '16px'}
      />
    );
  }
  return (
    <>
      <div className={cx(cls.tabBar, headerClassName)}>
        {tabs.map((tab, index) => (
          <div
            key={tab.title}
            className={cx(cls.tabButton, tabButtonClassName, {
              [selectedTabClass]: index === currentTabIndex,
            })}
            onClick={() => {
              onTabChanged(index);
            }}
          >
            {getIcon(tab, index)}
            <Text
              size="subtitle2"
              className={cls.tabButtonText}
              style={
                currentTabIndex !== index
                  ? {
                      color: colors.neutralDarker,
                    }
                  : {
                      color: theme.colors.primary,
                    }
              }
            >
              {tab.title}
            </Text>
          </div>
        ))}
        {renderTabRightEndComponent && renderTabRightEndComponent({ tabIndex: currentTabIndex })}
      </div>
      {tabs[currentTabIndex].content}
    </>
  );
};

const useStyles = createUseStyles((theme) => ({
  tabBar: {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: `1px solid ${theme.lines.color}`,
  },
  iconWrapper: {
    marginRight: spacers.small,
  },
  tabButton: {
    paddingTop: spacers.default,
    paddingBottom: spacers.default,
    marginRight: spacers.default,
    borderColor: theme.colors.neutral,
    display: 'flex',
    alignItems: 'center',
    gap: spacers.small,
    '&:hover': {
      cursor: 'pointer',

      ...({
        '& $tabButtonText': {
          ...makeImportant({
            ...fonts.subtitle2,
            color: theme.colors.primary,
          }),
        },
        '& $tabButtonIcon': {
          ...makeImportant({
            color: theme.colors.primary,
          }),
        },
      } as NestedCSSElement),
    },
  },
  tabButtonText: {},
  tabButtonIcon: {
    marginRight: spacers.small,
  },
}));
