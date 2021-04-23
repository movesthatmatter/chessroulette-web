import React, { useState } from 'react';
import { Button, ButtonProps } from 'src/components/Button';
import { useHistory } from 'react-router-dom';
import { useAuthenticationService } from '../../useAuthentication';
import { Dialog } from 'src/components/Dialog/Dialog';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';
import { createUseStyles } from 'src/lib/jss';
import { Text } from 'src/components/Text';
import { Emoji } from 'src/components/Emoji';
import { Events } from 'src/services/Analytics';

type Props = Omit<ButtonProps, 'onClick' | 'label'> & {};

export const LogoutButton: React.FC<Props> = ({ ...buttonProps }) => {
  const cls = useStyles();
  const history = useHistory();
  const authenticationService = useAuthenticationService();
  const [showConfrmation, setShowConfirmation] = useState(false);

  return (
    <>
      <Button
        label="Log out"
        onClick={() => setShowConfirmation(true)}
        {...buttonProps}
      />
      <Dialog
        visible={showConfrmation}
        onClose={() => setShowConfirmation(false)}
        title="Are you sure you want to log out?"
        contentContainerClass={cls.dialogContentContainer}
        content={
          <>
            <Text size="body1">I'm not gonna get upset! At all...</Text>
            <Emoji symbol="🥺" />
            <br />
            <br />
            <div className={cls.mutunachiContainer}>
              <Mutunachi mid="10" />
            </div>
          </>
        }
        buttonsStacked
        buttons={[
          {
            type: 'negative',
            label: 'Yes. Log me out!',
            onClick: () => {
              authenticationService.remove();
              Events.trackDeauthenticated();
              history.replace('/');
            },
          },
          {
            type: 'secondary',
            label: "I'm staying!",
            full: true,
            onClick: () => {
              setShowConfirmation(false);
            },
          },
        ]}
      />
    </>
  );
};

const useStyles = createUseStyles({
  mutunachiContainer: {
    width: '40%',
    maxWidth: '300px',
    margin: '0 auto',
  },
  mutunachi: {
    height: '100%',
  },
  dialogContentContainer: {
    textAlign: 'center',
  },
});
