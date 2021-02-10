import React, { useState } from 'react';
import { Dialog } from 'src/components/Dialog/Dialog';
import { createUseStyles } from 'src/lib/jss';
import { useDispatch } from 'react-redux';
import { AspectRatio } from 'src/components/AspectRatio';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';
import { RegistrationForm, RegistrationUserInfo } from '../../components/RegistrationForm';
import { VerificationForm } from '../../components/VerificationForm';
import * as resources from '../../resources';
import { authenticateWithAccessTokenEffect } from '../../effects';
import { keyInObject } from 'src/lib/util';
import { CreateUserAccountRequestPayload } from 'dstnd-io';


type Props = {
  visible: boolean;
  onClose?: () => void;
};

export const AuthenticationDialog: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [registrationUserInfo, setRegistrationUserInfo] = useState<RegistrationUserInfo>();
  const [
    verifiedExternalVendorInfo,
    setVerifiedExternalVendorInfo,
  ] = useState<CreateUserAccountRequestPayload['data']['external']>();

  const dispatch = useDispatch();

  return (
    <Dialog
      visible={props.visible}
      title={
        registrationUserInfo ? "Yey! We'll be best friends!" : "I'm so excited to meet you!"
      }
      onClose={props.onClose}
      graphic={(
        <AspectRatio aspectRatio={1} className={cls.mutunachiContainer}>
          {registrationUserInfo ? (
            <Mutunachi mid="11" className={cls.mutunachi} />
          ) : (
              <Mutunachi mid="1" className={cls.mutunachi} />
            )}
        </AspectRatio>
      )}
      content={(
        <>
          {registrationUserInfo ? (
            <RegistrationForm
              userInfo={registrationUserInfo}
              onSubmit={(input) => {
                return resources.createUser({
                  email: input.email,
                  firstName: input.firstName,
                  lastName: input.lastName,
                  external: verifiedExternalVendorInfo,
                })
                  .mapErr((e) => {
                    if (e.type === 'ValidationErrors') {
                      return {
                        type: 'SubmissionValidationErrors',
                        content: e.content,
                      } as const;
                    }
                    // if (e.type === '')
                    return {
                      type: 'SubmissionGenericError',
                      content: undefined,
                    } as const;
                  })
                  .map((r) => {
                    dispatch(authenticateWithAccessTokenEffect(r.accessToken));
                  });
              }}
            />
          ) : (
              <VerificationForm
                onSubmit={(input) => {
                  return resources
                    .checkUser(input)
                    .mapErr((e) => {
                      console.log('verification failed', e);

                      if (e.type === 'VerificationFailed' && input.type === 'internal') {
                        return {
                          type: 'SubmissionValidationErrors',
                          content: {
                            fields: {
                              code: 'The Verification Code is incorrect!',
                            },
                          },
                        } as const;
                      };

                      return {
                        type: 'SubmissionGenericError',
                        content: undefined,
                      } as const;
                    })
                    .map((r) => {
                      if (r.status === 'ExistentUser') {
                        dispatch(authenticateWithAccessTokenEffect(r.accessToken));
                      } else if (r.status === 'InexistentUser') {
                        if (input.type === 'internal') {
                          setRegistrationUserInfo(input);
                        } else if (r.external) {
                          setVerifiedExternalVendorInfo({
                            vendor: input.vendor,
                            accessToken: input.accessToken,
                          });

                          setRegistrationUserInfo({
                            type: 'external',
                            email: r.external.user.email,
                            ...keyInObject(r.external.user, 'firstName') && {
                              firstName: r.external.user.firstName,
                            },
                            ...keyInObject(r.external.user, 'lastName') && {
                              firstName: r.external.user.lastName,
                            },
                          });
                        }
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
