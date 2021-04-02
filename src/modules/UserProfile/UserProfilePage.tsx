import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'src/components/Button';
import { Form } from 'src/components/Form';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';
import { AuthenticatedPage } from 'src/components/Page';
import { TextInput } from 'src/components/TextInput';
import { createUseStyles } from 'src/lib/jss';
import { validator } from 'src/lib/validator';
import {
  connectExternalAccountEffect,
  refreshAuthenticatedUser,
} from 'src/services/Authentication';
import {updateUser} from 'src/services/Authentication/resources'
import { borderRadius, colors, floatingShadow, fonts } from 'src/theme';
import { FacebookAuthButton } from 'src/vendors/facebook';
import { LichessAuthButton } from 'src/vendors/lichess';
import { updateUserAction } from 'src/services/Authentication/actions';
import { AsyncResultWrapper, Ok } from 'dstnd-io';
import { delay } from 'fp-ts/lib/Task';

type Props = {};

export const UserProfilePage: React.FC<Props> = (props) => {
  const cls = useStyles();
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => {
    // Make sure the user is up to date
    dispatch(refreshAuthenticatedUser());
  }, []);

  return (
    <>
    <AuthenticatedPage
      render={({ user }) => {
        return (
          <Form<{ firstName: string; lastName: string}>
            validator={{
              firstName: [validator.rules.name(), validator.messages.firstName],
              lastName: [validator.rules.name(), validator.messages.lastName],
            }}
            initialModel={user}
            onSubmit={(model) => {
              if (model.firstName === user.firstName || model.lastName === user.lastName){
                return new AsyncResultWrapper(async () => {
                  setEditMode(false);
                  return Ok.EMPTY;
                });
              }
              return updateUser({
                firstName : model.firstName,
                lastName:  model.lastName,
              })
              .mapErr((e) => {
                return {
                  type: 'SubmissionGenericError',
                  content: undefined,
                } as const;
              })
              .map((user) => {
                dispatch(updateUserAction({ user }));
                setEditMode(false);
              })
            }}
            render={(p) => (
              <div className={cls.wrapper}>
                <div className={cls.titleContainer}>
                  <div className={cls.title}>My Profile</div>
                  {editMode ? (
                    <Button
                      style={{ width: '100px' }}
                      label="Done"
                      type='positive'
                      onClick={() => {
                        p.submit();
                      }}
                    />
                  ) : (
                    <Button
                      style={{ width: '100px' }}
                      label="Edit"
                      type="secondary"
                      withLoader
                      onClick={() => setEditMode(true)}
                    />
                  )}
                </div>
                <div className={cls.detailsContainer}>
                  <div className={cls.fieldWrapper}>
                    <div className={cls.field}>First Name: </div>
                    <div className={cls.propertyContainer}>
                      {editMode ? (
                        <TextInput
                          className={cls.input}
                          value={p.model.firstName}
                          placeholder={user.firstName}
                          onChange={(e) => p.onChange('firstName', e.target.value)}
                          onBlur={() => p.validateField('firstName')}
                          validationError={p.errors.validationErrors?.firstName}
                        />
                      ) : (
                        <div className={cls.property}>{user.firstName}</div>
                      )}
                    </div>
                  </div>
                  <div className={cls.fieldWrapper}>
                    <div className={cls.field}>Last Name: </div>
                    <div className={cls.propertyContainer}>
                      {editMode ? (
                        <TextInput
                          className={cls.input}
                          value={p.model.lastName}
                          placeholder={user.lastName}
                          onChange={(e) => p.onChange('lastName', e.target.value)}
                          onBlur={() => p.validateField('lastName')}
                          validationError={p.errors.validationErrors?.lastName}
                        />
                      ) : (
                        <div className={cls.property}>{user.lastName}</div>
                      )}
                    </div>
                  </div>
                  <div className={cls.fieldWrapper}>
                    <div className={cls.field}>E-mail: </div>
                    <div className={cls.propertyContainer}>
                        <div className={cls.property}>{user.email}</div>
                    </div>
                  </div>
                  <div className={cls.fieldWrapper}>
                    <div className={cls.field}>Avatar: </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent:'center' }}>
                      <Mutunachi
                        mid={user.avatarId}
                        style={{ width: '150px', marginBottom: '20px' }}
                      />
                      {/* <div style={{alignSelf: 'center'}}>
                      <Button
                        label="Choose"
                        type="secondary"
                        onClick={() => {
                          setShowAvatarModal(true)
                        }}
                      />
                      </div> */}
                    </div>
                  </div>
                </div>
                <div style={{ paddingTop: 30 }}>
                  <div style={{ width: '270px', marginBottom: '30px' }}>Connected Accounts:</div>
                  {user.externalAccounts?.lichess?.userId ? (
                    <div className={cls.lichessConnected}>Lichess</div>
                  ) : (
                    <LichessAuthButton
                      full
                      label="Connect Lichess"
                      type="secondary"
                      onSuccess={async (accessToken) => {
                        dispatch(
                          connectExternalAccountEffect({
                            vendor: 'lichess',
                            accessToken,
                          })
                        );
                      }}
                    />
                  )}
                  {user.externalAccounts?.facebook?.userId ? (
                    <div className={cls.facebookConnected}>Facebook</div>
                  ) : (
                    <FacebookAuthButton
                      label="Connect Facebook"
                      full
                      onSuccess={async (accessToken) => {
                        dispatch(
                          connectExternalAccountEffect({
                            vendor: 'facebook',
                            accessToken,
                          })
                        );
                      }}
                    />
                  )}
                </div>
              </div>
            )}
          />
        );
      }}
    ></AuthenticatedPage>
    </>
  );
};

const useStyles = createUseStyles({
  wrapper: {
    width: 'fit-content',
    padding: '20px',
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  titleContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    ...fonts.subtitle1,
  },
  edit: {},
  detailsContainer: {
    marginTop: '40px',
  },
  fieldWrapper: {
    display: 'flex',
    marginBottom: '14px',
    alignItems: 'center',
    '&:last-child': {
      alignItems: 'end',
    },
  },
  field: {
    width: '110px',
  },
  propertyContainer: {
    ...borderRadius,
    width: '230px',
    padding: '6px',
  },
  input: {
    marginBottom: '0px',
  },
  property: {
    marginLeft: '10px',
  },
  lichessConnected: {
    backgroundColor: colors.secondary,
    padding: '8px',
    ...borderRadius,
    ...floatingShadow,
    color: colors.neutralDarkest,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  facebookConnected: {
    backgroundColor: colors.primary,
    padding: '8px',
    ...borderRadius,
    ...floatingShadow,
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  avatar: {
    background: '#ddd',
    ...floatingShadow,
  },
});
