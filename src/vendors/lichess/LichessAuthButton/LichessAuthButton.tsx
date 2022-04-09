import React from 'react';
import { JWTToken } from 'chessroulette-io';
import { ButtonProps } from 'src/components/Button';
import { OAuthButton, getRedirectUrl } from 'src/services/Oauth2';

type Props = Omit<ButtonProps, 'onClick' | 'label'> & {
  label?: ButtonProps['label'];
  onSuccess: (token: JWTToken) => void;
};

export const LichessAuthButton: React.FC<Props> = ({
  label = 'Lichess Login',
  onSuccess,
  ...props
}) => {
  return (
    <OAuthButton
      label={label}
      onSuccess={onSuccess}
      vendor="lichess"
      getOauthUrl={async () => {
        const res = await getRedirectUrl('lichess')
          .map(({ redirectUrl }) => redirectUrl)
          .resolve();

        if (res.ok) {
          return res.val;
        }

        throw new Error(res.val);
      }}
      {...props}
    />
  );
};
