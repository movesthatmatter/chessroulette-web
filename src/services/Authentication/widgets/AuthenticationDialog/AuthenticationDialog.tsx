import React, { useState } from 'react';
import { Dialog } from 'src/components/Dialog/Dialog';
import { createUseStyles } from 'src/lib/jss';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';
import { RegistrationForm, RegistrationUserInfo } from '../../components/RegistrationForm';
import { VerificationForm } from '../../components/VerificationForm';
import * as resources from '../../resources';
import { keyInObject } from 'src/lib/util';
import {
  AccessToken,
  CreateUserAccountRequestPayload,
  JWTToken,
  Oauth2AccessToken,
  RegisteredUserRecord,
} from 'dstnd-io';
import { CodeVerificationForm } from '../../components/CodeVerificationForm';
import { UserAccountInfo } from '../../types';
import { onlyMobile } from 'src/theme';
import { Emoji } from 'src/components/Emoji';
import capitalize from 'capitalize';
import { useAuthenticationService } from '../../useAuthentication';
import { Events } from 'src/services/Analytics';
import { AsyncResult } from 'ts-async-results';

type Props = {
  visible: boolean;
  onClose?: () => void;
};

type VerificationStep = {
  name: 'VerificationStep';
  state: undefined;
};

type RegistrationStep = {
  name: 'RegistrationStep';
  state: {
    registrationUserInfo: RegistrationUserInfo;
    verificationToken: JWTToken;
    verifiedExternalVendorInfo?: CreateUserAccountRequestPayload['data']['external'];
  };
};

type ExternalConnectionStep = {
  name: 'ExternalAccountConnectionStep';
  state: {
    vendor: NonNullable<CreateUserAccountRequestPayload['data']['external']>['vendor'];
    email: RegisteredUserRecord['email'];
    accessToken: Oauth2AccessToken;
  };
};

type Steps = VerificationStep | RegistrationStep | ExternalConnectionStep;

export const AuthenticationDialog: React.FC<Props> = (props) => {
  const cls = useStyles();
  const authenticationService = useAuthenticationService();
  // Todo, there could be a prop determining this
  const [currentStepState, setCurrentStepState] = useState<Steps>({
    name: 'VerificationStep',
    state: undefined,
  });

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
        }

        return {
          type: 'SubmissionGenericError',
          content: undefined,
        } as const;
      })
      .map((r) => {
        if (r.status === 'ExistentUser') {
          authenticationService
            .create({
              isGuest: false,
              authenticationToken: r.authenticationToken,
            })
            .map(() => {
              const via = input.type === 'external' ? input.vendor : 'email';

              Events.trackAuthenticated('login', via);
            });
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
                  ...(keyInObject(r.external.user, 'firstName') && {
                    firstName: r.external.user.firstName,
                  }),
                  ...(keyInObject(r.external.user, 'lastName') && {
                    firstName: r.external.user.lastName,
                  }),
                  ...(r.external.vendor === 'lichess' && {
                    username: r.external.user.username,
                  }),
                },
                verifiedExternalVendorInfo: {
                  vendor: input.vendor,
                  accessToken: (input.token as unknown) as AccessToken,
                },
                verificationToken: r.verificationToken,
              },
            });
          }
        } else if (
          r.status === 'InexistentExternalUserMatchesExistentUser:Email' &&
          input.type === 'external'
        ) {
          setCurrentStepState({
            name: 'ExternalAccountConnectionStep',
            state: {
              vendor: r.vendor,
              email: r.email,
              accessToken: input.token as Oauth2AccessToken,
            },
          });
        }
      });
  };

  const steps = {
    verification: (_: undefined) => ({
      title: `I'm so excited to meet you!`,
      graphic: <Mutunachi mid="1" className={cls.mutunachi} />,
      content: <VerificationForm onSubmit={authenticate} />,
    }),
    registration: (s: RegistrationStep['state']) => ({
      title: `Heey, you're new around here!`,
      graphic: <Mutunachi mid="11" className={cls.mutunachi} />,
      content: (
        <RegistrationForm
          userInfo={s.registrationUserInfo}
          onSubmit={(input) => {
            return resources
              .createUser({
                firstName: input.firstName,
                lastName: input.lastName,
                verificationToken: s.verificationToken,
                username: input.username,
                countryCode: input.countryCode,
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
                authenticationService
                  .create({
                    isGuest: false,
                    authenticationToken: r.authenticationToken,
                  })
                  .map(() => {
                    const via = s.verifiedExternalVendorInfo
                      ? s.verifiedExternalVendorInfo.vendor
                      : 'email';

                    Events.trackAuthenticated('registration', via);
                  });
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
            return (
              authenticate(input)
                // Send a request to connect the external account
                // TODO: In the future this should be handled on the server!
                .map(
                  AsyncResult.passThrough(() => {
                    resources.connectExternalAccount({
                      vendor: s.vendor,
                      accessToken: s.accessToken,
                    });
                  })
                )
            );
          }}
          infoText={
            <>
              It looks like the email attached to your <strong>{capitalize(s.vendor)}</strong>
              {` `}account belongs to somebody else!
              <br />
              <br />
              If that's you please verify it by entering the code I sent to{' '}
              <strong>{s.email}</strong>
              {` `}
              <Emoji symbol="😎" />
            </>
          }
        />
      ),
    }),
  };

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
      graphic={
        // <AspectRatio aspectRatio={1} className={cls.mutunachiContainer}>
        <div className={cls.mutunachiContainer}>{currentStep.graphic}</div>
        // </AspectRatio>
      }
      content={currentStep.content}
      contentContainerClass={cls.contentContainer}
    />
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {},
  contentContainer: {
    paddingTop: '16px',
    paddingBottom: 0,
  },
  mutunachiContainer: {
    width: '50%',
    maxWidth: '300px',
    margin: '0 auto',
  },
  mutunachi: {
    height: '100%',
  },
  infoTextWrapper: {
    textAlign: 'center',
    paddingBottom: '24px',

    ...onlyMobile({
      paddingBottom: '12px',
    }),
  },
  infoText: {
    color: theme.colors.neutralDarker,
  },
}));
