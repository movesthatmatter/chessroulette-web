import React from 'react';
import cx from 'classnames';
import { ButtonProps } from 'src/components/Button';
import { createUseStyles } from 'src/lib/jss';
import { OAuthButton, getRedirectUrl } from 'src/services/Oauth2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitch } from '@fortawesome/free-brands-svg-icons';

type Props = Omit<ButtonProps, 'onClick' | 'label'> & {
  label?: ButtonProps['label'];
  onSuccess: (token: string) => void;
};

export const TwitchAuthButton: React.FC<Props> = ({
  label = 'Twitch Login',
  className,
  onSuccess,
  ...props
}) => {
  const cls = useStyles();

  return (
    <OAuthButton
      label={label}
      onSuccess={onSuccess}
      vendor="twitch"
      className={cx(cls.button, className)}
      icon={() => <FontAwesomeIcon icon={faTwitch} color={'#fff'} size="lg" />}
      getOauthUrl={async () => {
        const res = await getRedirectUrl('twitch')
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

const useStyles = createUseStyles({
  button: {
    background: '#6441a5 !important',
  },
});
