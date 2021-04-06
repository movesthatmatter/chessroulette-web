import React, { useState } from 'react';
import { Button, ButtonProps } from 'src/components/Button';
import { useHistory } from 'react-router-dom';
import { useAuthenticationService } from '../../useAuthentication';
import { Dialog } from 'src/components/Dialog/Dialog';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';
import { AspectRatio } from 'src/components/AspectRatio';
import { createUseStyles } from 'src/lib/jss';
import { Text } from 'src/components/Text';
import { Emoji } from 'src/components/Emoji';

type Props = Omit<ButtonProps, 'onClick' | 'label'> & {};

export const LogoutButton: React.FC<Props> = ({ ...buttonProps }) => {
  const cls = useStyles();
  const history = useHistory();
  const authenticationService = useAuthenticationService();
  const [showConfrmation, setShowConfirmation] = useState(false);

  return (
    <>
      <Button label="Log out" onClick={() => setShowConfirmation(true)} {...buttonProps} />
      <Dialog
        visible={showConfrmation}
        onClose={() => setShowConfirmation(false)}
        title="Are you sure you want to log out?"
        contentContainerClass={cls.dialogContentContainer}
        content={
          <>
            <Text size="small1">
              I'm not gonna get upset! At all...
            </Text>
            <Emoji symbol="🥺" />
            <br/>
            <br/>
            <AspectRatio aspectRatio={1} className={cls.mutunachiContainer}>
              <Mutunachi mid="10" />
            </AspectRatio>
          </>
        }
        // graphic={

        // }
        buttonsStacked
        buttons={[
          {
            type: 'negative',
            label: 'Yes. Log me out!',
            onClick: () => {
              authenticationService.remove();
              history.replace('/');
            },
          },
          {
            type: 'secondary',
            label: 'I\'m staying!',
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
    width: '60%',
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
