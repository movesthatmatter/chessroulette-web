import React, { useState } from 'react';
import { Text } from 'src/components/Text';
import { createUseStyles, makeImportant, NestedCSSElement } from 'src/lib/jss';
import { CustomTheme, fonts } from 'src/theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { spacers } from 'src/theme/spacers';
import { noop } from 'src/lib/util';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import cx from 'classnames';

type TabProps = {
  title: string;
  icon?: IconProp;
  content: string | React.ReactNode;
};

type TabsProps = {
  tabs: TabProps[];
  currentTabIndex: number;
  onTabChanged: (nextIndex: number) => void;
  renderTabRightEndComponent?: (p: { tabIndex: number }) => React.ReactNode;
  selectedTabButtonClassName?: string;
  containerClassName?: string;
  headerClassName?: string;
  tabButtonClassName?: string;
};

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  onTabChanged = noop,
  currentTabIndex = 0,
  renderTabRightEndComponent,
  selectedTabButtonClassName,
  containerClassName,
  headerClassName,
  tabButtonClassName,
}) => {
  const cls = useStyles();
  const { theme } = useColorTheme();
  const colors = theme.colors;
  const selectedTabClass = selectedTabButtonClassName || '';
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
            <Text
              size="subtitle2"
              className={cls.tabButtonText}
              style={
                currentTabIndex !== index
                  ? {
                      color: colors.neutralDarker,
                    }
                  : {
                      color: theme.text.baseColor,
                    }
              }
            >
              {tab.icon && (
                <FontAwesomeIcon
                  icon={tab.icon}
                  className={cls.tabButtonIcon}
                  size="lg"
                  color={currentTabIndex === index ? colors.primary : colors.neutral}
                />
              )}
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
    '&:hover': {
      cursor: 'pointer',

      ...({
        '& $tabButtonText': {
          ...makeImportant({
            ...fonts.subtitle2,
            color: theme.text.baseColor,
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
