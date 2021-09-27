import React from 'react';
import { Button } from 'src/components/Button';
import { Form } from 'src/components/Form';
import { TextInput } from 'src/components/TextInput';
import { createUseStyles } from 'src/lib/jss';
import { validator } from 'src/lib/validator';
import { updateUser } from 'src/services/Authentication/resources';
import { updateUserAction } from 'src/services/Authentication/actions';
import { CountryCode, RegisteredUserRecord } from 'dstnd-io';
import { useDispatch } from 'react-redux';
import { Avatar } from 'src/components/Avatar';
import { Hr } from 'src/components/Hr';
import { GetCountries } from 'src/services/Location';
import { SelectInput } from 'src/components/Input/SelectInput';
import { onlyDesktop, onlyMobile } from 'src/theme';
import { SearchBar } from 'src/components/SearchBar/SearchBar';

type Props = {
  user: RegisteredUserRecord;
};

type Model = {
  firstName: string;
  lastName: string;
  countryCode: CountryCode;
  countryName: string;
};

export const UserDetails: React.FC<Props> = ({ user }) => {
  const cls = useStyles();
  const dispatch = useDispatch();

  return (
    <div className={cls.container}>
      <div className={cls.avatarWrapper}>
        <Avatar mutunachiId={Number(user.avatarId)} className={cls.avatar} size="35%" />
      </div>
      <div className={cls.spacer} />
      <div className={cls.fieldsContainer}>
        <div className={cls.requiredFieldsContainer}>
          <TextInput
            label="Email"
            defaultValue={user.email}
            readOnly
            placeholder="beth.harmon@queens.gambit"
            className={cls.input}
          />
          <TextInput
            label="Username"
            defaultValue={user.username}
            readOnly
            placeholder="beth.harmon"
            className={cls.input}
          />
        </div>
        <Form<Model>
          validator={{
            firstName: [validator.rules.name(), validator.messages.firstName],
            lastName: [validator.rules.name(), validator.messages.lastName],
            countryCode: [validator.rules.notEmpty(), validator.messages.notEmpty],
          }}
          initialModel={{
            ...user,
            countryCode: user.country?.code,
            countryName: user.country?.name,
          }}
          validateOnChange
          onSubmit={(model) =>
            updateUser({
              firstName: model.firstName,
              lastName: model.lastName,
              countryCode: model.countryCode,
            })
              .mapErr(() => {
                return {
                  type: 'SubmissionGenericError',
                  content: undefined,
                } as const;
              })
              .map((user) => {
                dispatch(updateUserAction({ user }));
              })
          }
          render={(p) => (
            <>
              <div className={cls.formContainer}>
                <div className={cls.inputWrapper}>
                  <TextInput
                    label="First Name"
                    defaultValue={p.model.firstName}
                    placeholder="Beth"
                    className={cls.input}
                    onChange={({ currentTarget }) => p.onChange('firstName', currentTarget.value)}
                    validationError={
                      p.errors.validationErrors?.firstName ||
                      p.errors.submissionValidationErrors?.firstName
                    }
                  />
                </div>
                <div className={cls.inputWrapper}>
                  <TextInput
                    label="Last Name"
                    defaultValue={p.model.lastName}
                    placeholder="Beth"
                    className={cls.input}
                    onChange={({ currentTarget }) => p.onChange('lastName', currentTarget.value)}
                    validationError={
                      p.errors.validationErrors?.lastName ||
                      p.errors.submissionValidationErrors?.lastName
                    }
                  />
                </div>
                {/* <div className={cls.inputWrapper}>
                <TextInput
                  label="Prefered Language"
                  value="English"
                  placeholder="English"
                  className={cls.input}
                />
              </div> */}
                <GetCountries
                  render={({ countries, countriesForDisplay, isLoading, fetch }) => (
                    <div className={cls.inputWrapper}>
                      <SelectInput
                        multiple
                        label="Aaand where do you live?"
                        placeholder="Bolivia"
                        options={
                          countries &&
                          countriesForDisplay.map(c => ({
                            label: c.name,
                            value: c.code,
                          }))
                        }
                        value={
                          p.model.countryCode && p.model.countryName
                            ? {
                                label: p.model.countryName,
                                value: p.model.countryCode,
                              }
                            : undefined
                        }
                        isLoading={isLoading}
                        menuPlacement="top"
                        onFocus={() => {
                          if (!(countries || isLoading)) {
                            fetch();
                          }
                        }}
                        onSelect={({ value, label }) => {
                          p.onChange('countryCode', value);
                          p.onChange('countryName', label);
                        }}
                        validationError={
                          p.errors.validationErrors?.countryCode ||
                          p.errors.submissionValidationErrors?.countryCode
                        }
                      />
                      
                    </div>
                  )}
                />
              </div>
              <div className={cls.inputWrapper}>
                <Button
                  label="Save Changes"
                  withLoader
                  full
                  disabled={!p.canSubmit}
                  type="positive"
                  onClick={p.submit}
                />
              </div>
            </>
          )}
        />
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    height: '100%',
    // display: 'flex',
    // flexDirection: 'row',

    ...onlyDesktop({
      width: '50%',
    }),
  },
  avatarWrapper: {
    // flex: .7,
  },
  avatar: {
    ...onlyMobile({
      margin: '0 auto',
    }),
  },
  fieldsContainer: {
    flex: 1,
  },
  spacer: {
    marginBottom: '24px',
  },
  requiredFieldsContainer: {},
  formContainer: {
    paddingBottom: '16px',
    display: 'flex',
    flexDirection: 'column',
  },
  inputWrapper: {},
  input: {},
});
