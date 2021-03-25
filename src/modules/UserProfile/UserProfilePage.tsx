import { Avatar } from 'grommet';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'src/components/Button';
import { Form } from 'src/components/Form';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';
import { AuthenticatedPage } from 'src/components/Page';
import { Text } from 'src/components/Text';
import { TextInput } from 'src/components/TextInput';
import {TextInput as GrommetTextInput} from 'grommet';
import { createUseStyles } from 'src/lib/jss';
import { validator } from 'src/lib/validator';
import {
  connectExternalAccountEffect,
  updateAuthenticatedUser,
  useAuthenticatedUser,
} from 'src/services/Authentication';
import { borderRadius, colors, floatingShadow, fonts } from 'src/theme';
import { FacebookAuthButton } from 'src/vendors/facebook';
import { LichessAuthButton } from 'src/vendors/lichess';
import { AsyncResultWrapper, Ok } from 'dstnd-io';

type Props = {};

export const UserProfilePage: React.FC<Props> = (props) => {
  const cls = useStyles();
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  useEffect(() => {
    // Make sure the user is up to date
    dispatch(updateAuthenticatedUser());
  }, []);

  return (
    <AuthenticatedPage
      render={({ user }) => {
        return (
          <Form<{ firstName: string; lastName: string; email: string }>
            validator={{
              firstName: [validator.rules.name(), validator.messages.firstName],
              lastName: [validator.rules.name(), validator.messages.lastName],
              email: [validator.rules.email(), validator.messages.email],
            }}
            onSubmit={() => {
              return new AsyncResultWrapper(async () => {
                return Ok.EMPTY;
              });
            }}
            render={(p) => (
              <div className={cls.wrapper}>
                <div className={cls.titleContainer}>
                  <div className={cls.title}>My Profile</div>
                  {editMode  
                  ? < Button style={{width: '100px'}} label='Done' type='secondary' onClick={() => {
                    console.log('submittiin', p);
                    p.submit();
                    setEditMode(false)
                  }}/>
                  : <Button style={{width: '100px'}}  label="Edit" type="secondary" withLoader onClick={() => setEditMode(true)}/>}
                </div>
                <div className={cls.detailsContainer}>
                  <div className={cls.fieldWrapper}>
                    <div className={cls.field}>First Name: </div>
                    <div className={cls.propertyContainer}>
                      {editMode 
                      ? <TextInput
                      className={cls.input}
                      value={p.model.firstName}
                      placeholder={user.firstName}
                      onChange={(e) => p.onChange('firstName', e.target.value)}
                      onBlur={() => p.validateField('firstName')}
                      validationError={p.errors.validationErrors?.firstName}
                      /> 
                      : <div className={cls.property}>{user.firstName}</div>}
                    </div>
                  </div>
                  <div className={cls.fieldWrapper}>
                    <div className={cls.field}>Last Name: </div>
                    <div className={cls.propertyContainer}>
                      {editMode 
                      ? <TextInput
                      className={cls.input}
                      value={p.model.lastName}
                      placeholder={user.lastName}
                      onChange={(e) => p.onChange('lastName', e.target.value)}
                      onBlur={() => p.validateField('lastName')}
                      validationError={p.errors.validationErrors?.lastName}
                      /> 
                      : <div className={cls.property}>{user.lastName}</div>}
                    </div>
                  </div>
                  <div className={cls.fieldWrapper}>
                    <div className={cls.field}>E-mail: </div>
                    <div className={cls.propertyContainer}>
                      {editMode 
                      ? <TextInput
                      className={cls.input}
                      value={p.model.email}
                      placeholder={user.email}
                      onChange={(e) => p.onChange('email', e.target.value)}
                      onBlur={() => p.validateField('email')}
                      validationError={p.errors.validationErrors?.email}
                      /> 
                      : <div className={cls.property}>{user.email}</div>}
                    </div>
                  </div>
                  <div className={cls.fieldWrapper}>
                    <div className={cls.field}>Avatar: </div>
                    <Mutunachi mid={user.avatarId} style={{ width: '150px' }} />
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
  input:{
    marginBottom:'0px',
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
