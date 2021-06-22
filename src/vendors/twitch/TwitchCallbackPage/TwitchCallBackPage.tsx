import React from 'react';
import { OAuthCallbackPage } from 'src/services/Oauth2/components/OAuthCallbackPage';

type Props = {};

export const TwitchCallbackPage: React.FC<Props> = (props) => {
  return <OAuthCallbackPage {...props} vendor='twitch' />
};