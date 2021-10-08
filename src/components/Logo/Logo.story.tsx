/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { StorybookBaseProvider } from 'src/storybook/StorybookBaseProvider';
import { themes } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { Text } from '../Text';
import { Logo } from './Logo';

export default {
  component: Logo,
  title: 'components/Logo',
};

export const defaultStory = () => (
  <StorybookBaseProvider>
    <div
      style={{
        display: 'flex',
        flex: 1,
      }}
    >
      <div
        style={{
          padding: spacers.default,
          width: '320px',
        }}
      >
        <Text size="small1">Light Mode</Text>
        <div style={{ paddingBottom: spacers.large }} />
        <div style={{ paddingBottom: spacers.large }}>
          <Text size="small1">Default</Text>
          <Logo />
        </div>
        <div style={{ paddingBottom: spacers.large }}>
          <Text size="small1">With Beta</Text>
          <Logo withBeta />
        </div>
        <div style={{ paddingBottom: spacers.large }}>
          <Text size="small1">Mini</Text>
          <Logo mini />
        </div>
      </div>
      <div
        style={{
          padding: spacers.default,
          background: '#444',
          width: '320px',
        }}
      >
        <Text size="small1" style={{ color: themes.lightDefault.colors.white }}>
          Dark Mode
        </Text>
        <div style={{ paddingBottom: spacers.large }} />
        <div style={{ paddingBottom: spacers.large }}>
          <Text size="small1" style={{ color: themes.lightDefault.colors.white }}>
            Default
          </Text>
          <Logo darkBG />
        </div>
        <div style={{ paddingBottom: spacers.large }}>
          <Text size="small1" style={{ color: themes.lightDefault.colors.white }}>
            With Beta
          </Text>
          <Logo darkBG withBeta />
        </div>
        <div style={{ paddingBottom: spacers.large }}>
          <Text size="small1" style={{ color: themes.lightDefault.colors.white }}>
            Mini
          </Text>
          <Logo darkBG mini />
        </div>
        <div style={{ paddingBottom: spacers.large }}>
          <Text size="small1" style={{ color: themes.lightDefault.colors.white }}>
            With Outline
          </Text>
          <Logo mini withOutline />
        </div>
      </div>
      <div
        style={{
          padding: spacers.default,
          width: '320px',
        }}
      >
        <Text size="small1">With Custom Size</Text>
        <div style={{ paddingBottom: spacers.large }} />
        <div style={{ paddingBottom: spacers.large }}>
          <Text size="small1">Default</Text>
          <Logo />
        </div>
        <div style={{ paddingBottom: spacers.large }}>
          <Text size="small1">With Beta</Text>
          <Logo withBeta />
        </div>
        <div style={{ paddingBottom: spacers.large }}>
          <Text size="small1">Mini</Text>
          <Logo mini />
        </div>
      </div>
    </div>
  </StorybookBaseProvider>
);
