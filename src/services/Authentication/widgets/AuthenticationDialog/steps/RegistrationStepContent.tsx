import React from 'react';
import * as resources from '../../../resources';
import {
  RegistrationForm,
  RegistrationUserInfo,
} from '../../../components/RegistrationForm';
import { CreateUserAccountRequestPayload } from 'dstnd-io';
import { useDispatch } from 'react-redux';
import { authenticateWithAccessTokenEffect } from '../../../effects';

type Props = {
  registrationUserInfo: RegistrationUserInfo;
  verifiedExternalVendorInfo: CreateUserAccountRequestPayload['data']['external'];
};

export const RegistrationStepContent: React.FC<Props> = ({
  registrationUserInfo,
  verifiedExternalVendorInfo,
}) => {
  const dispatch = useDispatch();

  return (
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
  );
};
