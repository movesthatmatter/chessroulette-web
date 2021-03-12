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
import { AsyncResult, CreateUserAccountRequestPayload, RegisteredUserRecord } from 'dstnd-io';
import { CodeVerificationForm } from '../../components/CodeVerificationForm';
import { UserAccountInfo } from '../../types';
import { colors } from 'src/theme';
import { Emoji } from 'src/components/Emoji';
import capitalize from 'capitalize';


type Props = {
  visible: boolean;
  onClose?: () => void;
};

type VerificationStep = {
  name: 'VerificationStep',
  state: undefined,
};

type RegistrationStep = {
  name: 'RegistrationStep',
  state: {
    registrationUserInfo: RegistrationUserInfo,
    verificationToken: string;
    verifiedExternalVendorInfo?: CreateUserAccountRequestPayload['data']['external'];
  },
};

type ExternalConnectionStep = {
  name: 'ExternalAccountConnectionStep',
  state: {
    vendor: NonNullable<CreateUserAccountRequestPayload['data']['external']>['vendor'];
    email: RegisteredUserRecord['email'];
    accessToken: string;
  }
}

type Steps = VerificationStep | RegistrationStep | ExternalConnectionStep;

export const AuthenticationDialog: React.FC<Props> = (props) => {
  const cls = useStyles();
  // Todo, there could be a prop determining this
  const [currentStepState, setCurrentStepState] = useState<Steps>({
    name: 'VerificationStep',
    state: undefined,
  });

  const dispatch = useDispatch();

  const authenticate = (input: UserAccountInfo) => {
    return resources
      .authenticate(input)
      .mapErr((e) => {
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
            setCurrentStepState({
              name: 'RegistrationStep',
              state: {
                registrationUserInfo: input,
                verificationToken: r.verificationToken,
              },
            });
          } else if (r.external) {
            setCurrentStepState({
              name: 'RegistrationStep',
              state: {
                registrationUserInfo: {
                  type: 'external',
                  email: r.external.user.email,
                  ...keyInObject(r.external.user, 'firstName') && {
                    firstName: r.external.user.firstName,
                  },
                  ...keyInObject(r.external.user, 'lastName') && {
                    firstName: r.external.user.lastName,
                  },
                },
                verifiedExternalVendorInfo: {
                  vendor: input.vendor,
                  accessToken: input.accessToken,
                },
                verificationToken: r.verificationToken,
              }
            });
          }
        } else if (
          r.status === 'InexistentExternalUserMatchesExistentUser:Email'
          && input.type === 'external'
        ) {
          setCurrentStepState({
            name: 'ExternalAccountConnectionStep',
            state: {
              vendor: r.vendor,
              email: r.email,
              accessToken: input.accessToken,
            },
          });
        }
      });
  }

  const steps = {
    verification: (_: undefined) => ({
      title: `I'm so excited to meet you!`,
      graphic: <Mutunachi mid="1" className={cls.mutunachi} />,
      content: (
        <VerificationForm onSubmit={authenticate} />
      )
    }),
    registration: (s: RegistrationStep['state']) => ({
      title: `Yey! We'll be best friends!`,
      graphic: <Mutunachi mid="11" className={cls.mutunachi} />,
      content: (
        <RegistrationForm
          userInfo={s.registrationUserInfo}
          onSubmit={(input) => {
            return resources.createUser({
              firstName: input.firstName,
              lastName: input.lastName,
              verificationToken: s.verificationToken,
            })
              .mapErr((e) => {
                if (e.type === 'ValidationErrors') {
                  return {
                    type: 'SubmissionValidationErrors',
                    content: e.content,
                  } as const;
                }

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
      ),
    }),
    externalAccountConnection: (s: ExternalConnectionStep['state']) => ({
      title: `Heey! Is that you?`,
      graphic: <Mutunachi mid="4" className={cls.mutunachi} />,
      content: (
        <CodeVerificationForm
          emailToBeVerified={s.email}
          onSubmit={(input) => {
            return authenticate(input)
              // Send a request to connect the external account
              // TODO: In the future this should be handled on the server!
              .map(AsyncResult.passThrough(() => {
                resources.connectExternalAccount({
                  vendor: s.vendor,
                  accessToken: s.accessToken,
                });
              }))
          }}
          infoText={(
            <>
              It looks like the email attached to your <strong>{capitalize(s.vendor)}</strong>
              {` `}account belongs to somebody else!
              <br />
              <br />
              If that's you please verify it by entering the code I sent to <strong>{s.email}</strong>
              {` `}<Emoji symbol="😎" />
            </>
          )}
        />
      ),
    }),
  }

  const currentStep = (() => {
    if (currentStepState.name === 'VerificationStep') {
      return steps.verification(currentStepState.state);
    }

    if (currentStepState.name === 'RegistrationStep') {
      return steps.registration(currentStepState.state);
    }

    return steps.externalAccountConnection(currentStepState.state);
  })();

  return (
    <Dialog
      visible={props.visible}
      title={currentStep.title}
      onClose={props.onClose}
      graphic={(
        <AspectRatio aspectRatio={1} className={cls.mutunachiContainer}>
          {currentStep.graphic}
        </AspectRatio>
      )}
      content={currentStep.content}
      contentContainerClass={cls.contentContainer}
    />
  );
};

const useStyles = createUseStyles({
  container: {},
  contentContainer: {
    paddingBottom: 0,
  },
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
  infoTextWrapper: {
    textAlign: 'center',
    paddingBottom: '24px',
  },
  infoText: {
    color: colors.neutralDarker,
  },
});
