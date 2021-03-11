import React from 'react';
import { OAuthCallbackPage } from 'src/services/Oauth2/components/OAuthCallbackPage';

type Props = {};

export const LichessAuthCallbackPage: React.FC<Props> = (props) => {
  return <OAuthCallbackPage {...props} vendor="lichess" />
}
