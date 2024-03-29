import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Mutunachi } from '../Mutunachi/Mutunachi';
import { AspectRatio, AspectRatioProps } from '../AspectRatio';
import { Text } from '../Text';
import { spacers } from 'src/theme/spacers';

const errorsMap = {
  resourceNotFound: {
    title: `Missing In Action`,
    description: `What you're looking for isn't here, but hey – Keep Looking?!`,
    mid: '5',
  },
  genericError: {
    title: 'Ooops. Something went wrong!',
    description: `I'm not sure what to advice. Hmm – Try Again?!`,
    mid: '3',
  },
};

export type AwesomeErrorProps = AspectRatioProps & {
  minimal?: boolean;
  errorType?: keyof typeof errorsMap;
};

export const AwesomeError: React.FC<AwesomeErrorProps> = ({
  aspectRatio = { width: 1, height: 1 },
  minimal,
  errorType = 'genericError',
}) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      <AspectRatio aspectRatio={aspectRatio} className={cls.mutunachiContainer}>
        <Mutunachi mid={errorsMap[errorType].mid} className={cls.mutunachi} />
      </AspectRatio>
      {minimal || (
        <div className={cls.description}>
          <Text size="subtitle1">{errorsMap[errorType].title}</Text>
          <br />
          <Text size="small1" className={cls.description}>
            {errorsMap[errorType].description}
          </Text>
        </div>
      )}
    </div>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    width: '100%',
    textAlign: 'center',
  },
  mutunachiContainer: {
    width: '40%',
    maxWidth: '300px',
    margin: '0 auto',
  },
  mutunachi: {
    height: '100%',
  },

  '@keyframes pulse': {
    '0%': {
      opacity: 0.3,
    },

    '50%': {
      opacity: 0.95,
    },

    '100%': {
      opacity: 0.3,
    },
  },
  // textContainer: {
  //   padding: '16px',
  // },
  // title: {
  //   marginBottom: 0,
  //   color: theme.colors.neutralDarker,
  // },
  description: {
    marginTop: spacers.default,
    // fontSize: '50%',
    color: theme.colors.neutralDarker,
    fontWeight: 400,
  },
}));
