/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Avatar } from './Avatar';

export default {
  component: Avatar,
  title: 'components/Avatar',
};

export const defaultStory = () => (
  <div>
    <Avatar mutunachiId={2} size={128} />
    <br/>
    <Avatar mutunachiId={4} />
    <br/>
    <Avatar mutunachiId={5} size={200} />
    <br/>
    <Avatar mutunachiId={1} />
    <br/>
    <Avatar mutunachiId={9} size={32} />
    <br/>
    <Avatar mutunachiId={9} size={32} />
    <br/>
    <Avatar imageUrl="https://static-cdn.jtvnw.net/jtv_user_pictures/b0071102-a664-41ab-9bb1-792a1eee8403-profile_image-300x300.png" size={32} />
  </div>
);
