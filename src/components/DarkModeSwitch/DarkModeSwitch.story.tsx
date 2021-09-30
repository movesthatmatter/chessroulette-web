import { DarkModeSwitch } from './DarkModeSwitch';
import React from 'react';

export default {
  component: DarkModeSwitch,
  title: 'Components/Dark Mode Switch',
};

export const defaultStory = () =>
  React.createElement(() => {
    return (
    <DarkModeSwitch/>
    );
  });


// const SwitchStoryComponent : React.FC = () => {
//   const theme = useSelector(selectTheme);
//   return (
//     <StorybookThemeConsumer themeName={theme}>
//      <DarkModeSwitch />
//   </StorybookThemeConsumer>
//   )
// }