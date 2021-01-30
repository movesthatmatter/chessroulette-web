import React, { useState } from 'react';
import { Button } from 'src/components/Button';
import { Text } from 'src/components/Text';
import { TextInput } from 'src/components/TextInput';
import { createUseStyles } from 'src/lib/jss';
import { colors } from 'src/theme';


type Props = {
  userInfo: {
    email?: string;
    firstName?: string;
    lastName?: string;
  };
  onSubmit: (p: {
    email: string;
    firstName: string;
    lastName: string;
  }) => void;
};

export const RegistrationForm: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [model, setModel] = useState({
    email: props.userInfo.email || '',
    firstName: props.userInfo.firstName || '',
    lastName: props.userInfo.lastName || '',
  });

  return (
    <div className={cls.container}>
      <div className={cls.infoTextWrapper}>
        <Text size="body1" className={cls.infoText}>
          I just need to know a bit more about you.
        </Text>
      </div>
      <TextInput
        label={props.userInfo.email ? 'Is your email correct?' : 'What\'s your email?'}
        placeholder="beth.harmon@queens.gambit"
        value={model.email}
        onChange={(e) => {
          setModel({
            ...model,
            email: e.target.value,
          });
        }}
      />
      <TextInput
        label={props.userInfo.firstName ? 'What about your First Name?' : 'And what\'s your First Name?'}
        placeholder="Beth"
        value={model.firstName}
        onChange={(e) => {
          setModel({
            ...model,
            firstName: e.target.value,
          });
        }}
      />
      <TextInput
        label="Your Last Name?"
        placeholder="Harmon"
        value={model.lastName}
        onChange={(e) => {
          setModel({
            ...model,
            lastName: e.target.value,
          });
        }}
      />
      <Button
        label="Create Account"
        full
        onClick={() => props.onSubmit(model)}
      />
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    marginBottom: '-32px',
  },
  infoTextWrapper: {
    textAlign: 'center',
    paddingBottom: '24px',
  },
  infoText: {
    color: colors.neutralDarker,
  }
});
