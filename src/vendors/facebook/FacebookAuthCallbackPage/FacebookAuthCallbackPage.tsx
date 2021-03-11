import React from 'react';
import { OAuthCallbackPage } from 'src/services/Oauth2/components/OAuthCallbackPage';

type Props = {};

export const FacebookAuthCallbackPage: React.FC<Props> = (props) => {
  return <OAuthCallbackPage {...props} vendor="facebook" />
}