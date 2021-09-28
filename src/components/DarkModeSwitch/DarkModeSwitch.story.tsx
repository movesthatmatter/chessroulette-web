import { DarkModeSwitch } from './DarkModeSwitch';
import React from 'react';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
import { StorybookThemeConsumer } from 'src/storybook/StorybookThemeConsumer';
import { useSelector } from 'react-redux';
import { selectTheme } from 'src/theme/redux/selectors';

export default {
  component: DarkModeSwitch,
  title: 'Components/Dark Mode Switch',
};

export const defaultStory = () =>
  React.createElement(() => {
    return (
      <StorybookReduxProvider>
        <SwitchStoryComponent/>
      </StorybookReduxProvider>
    );
  });


const SwitchStoryComponent : React.FC = () => {
  const theme = useSelector(selectTheme);
  return (
    <StorybookThemeConsumer themeName={theme}>
     <DarkModeSwitch />
  </StorybookThemeConsumer>
  )
}