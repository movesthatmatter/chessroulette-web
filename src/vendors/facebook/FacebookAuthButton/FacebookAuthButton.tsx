import React from 'react';
import { ButtonProps } from 'src/components/Button';
import { OAuthButton, getRedirectUrl } from 'src/services/Oauth2';

type Props = Omit<ButtonProps, 'onClick' | 'label'> & {
  label?: ButtonProps['label'];
  onSuccess: (token: string) => void;
};

export const FacebookAuthButton: React.FC<Props> = ({
  label = 'Facebook Login',
  onSuccess,
  ...props
}) => {
  return (
    <OAuthButton
      label={label}
      onSuccess={onSuccess}
      vendor="facebook"
      getOauthUrl={async () => {
        const res = await getRedirectUrl('facebook').map(({ redirectUrl }) => redirectUrl).resolve();

        if (res.ok) {
          return res.val;
        }

        throw new Error(res.val);
      }}
      {...props}
    />
  );
};
