import React from 'react';
import { Text } from 'src/components/Text';
import { createUseStyles, makeImportant, NestedCSSElement } from 'src/lib/jss';
import { CustomTheme, darkTheme, fonts, lightTheme } from 'src/theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { spacers } from 'src/theme/spacers';
import { noop } from 'src/lib/util';
import { useLightDarkMode } from 'src/theme/hooks/useLightDarkMode';

type TabProps = {
  title: string;
  icon: IconProp;
  content: string | React.ReactNode;
};

type TabsProps = {
  tabs: TabProps[];
  currentTabIndex: number;
  onTabChanged: (nextIndex: number) => void;
  renderTabRightEndComponent?: (p: { tabIndex: number }) => React.ReactNode;
};

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  onTabChanged = noop,
  currentTabIndex = 0,
  renderTabRightEndComponent,
}) => {
  const cls = useStyles();
  const {theme} = useLightDarkMode();
  const colors = {
    ...(theme === 'light' ? lightTheme.colors : darkTheme.colors)
  }
  return (
    <>
      <div className={cls.tabBar}>
        {tabs.map((tab, index) => (
          <div
            key={tab.title}
            className={cls.tabButton}
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
                      color: colors.text,
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

const useStyles = createUseStyles<CustomTheme>(theme => ({
  tabBar: {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: `1px solid ${theme.colors.neutral}`,
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
