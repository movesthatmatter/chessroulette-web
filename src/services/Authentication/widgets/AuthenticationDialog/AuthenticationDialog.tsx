import React, { useState } from 'react';
import { Dialog } from 'src/components/Dialog/Dialog';
import { createUseStyles } from 'src/lib/jss';
import { useDispatch } from 'react-redux';
import { AspectRatio } from 'src/components/AspectRatio';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';
import { RegistrationForm } from '../../components/RegistrationForm';
import { VerificationForm } from '../../components/VerificationForm';
import * as resources from '../../resources';
import { UserAccountInfo } from '../../types';
import { authenticateWithAccessTokenEffect } from '../../effects';


type Props = {
  visible: boolean;
  onClose?: () => void;
};

export const AuthenticationDialog: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [userAccountInfo, setUserAccountInfo] = useState<UserAccountInfo>();

  const dispatch = useDispatch();

  return (
    <Dialog
      visible={props.visible}
      title={
        userAccountInfo ? "Yey! We'll be best friends!" : "I'm so excited to meet you!"
      }
      onClose={props.onClose}
      graphic={(
        <AspectRatio aspectRatio={1} className={cls.mutunachiContainer}>
          {userAccountInfo ? (
            <Mutunachi mid="11" className={cls.mutunachi} />
          ) : (
              <Mutunachi mid="1" className={cls.mutunachi} />
            )}
        </AspectRatio>
      )}
      content={(
        <>
          {userAccountInfo ? (
            <RegistrationForm
              userInfo={userAccountInfo}
              onSubmit={(input) => {
                resources.createUser({
                  email: input.email,
                  firstName: input.firstName,
                  lastName: input.lastName,
                  external: [
                    ...(userAccountInfo.type === 'external') ? [
                      {
                        externalVendor: userAccountInfo.externalVendor,
                        externalUserId: userAccountInfo.externalUserId,
                      }
                    ] : [],
                  ],
                }).map((r) => {
                  dispatch(authenticateWithAccessTokenEffect(r.accessToken));
                })
              }}
            />
          ) : (
              <VerificationForm
                onSubmit={(input) => {
                  resources.checkUser(input).map((r) => {
                    if (r.isUser) {
                      dispatch(authenticateWithAccessTokenEffect(r.accessToken));
                    } else {
                      setUserAccountInfo(input);
                    }
                  });
                }}
              />
            )}
        </>
      )}
    />
  );
};

const useStyles = createUseStyles({
  container: {},
  facebookButton: {
    paddingBottom: 0,
  },
  mutunachiContainer: {
    width: '60%',
    maxWidth: '300px',
    margin: '0 auto',
  },
  mutunachi: {
    height: '100%',
  },
});
