import React from 'react';
import { ButtonProps } from 'src/components/Button';
import { OAuthButton, getRedirectUrl } from 'src/services/Oauth2';

type Props = Omit<ButtonProps, 'onClick' | 'label'> & {
    label?: ButtonProps['label'];
    onSuccess: (token: string) => void;
  };

export const TwitchAuthButton: React.FC<Props> = ({
    label = 'Twitch Login', 
    onSuccess,
    ...props
    }) => {
  return (
      <OAuthButton
       label={label}
       onSuccess={onSuccess}
       vendor='twitch'
       getOauthUrl={async () => {
        const res = await getRedirectUrl('twitch').map(({redirectUrl}) => redirectUrl).resolve();
        if (res.ok){
            return res.val;
        }
        throw new Error(res.val);
       }}
       {...props}
       />
  );
};
