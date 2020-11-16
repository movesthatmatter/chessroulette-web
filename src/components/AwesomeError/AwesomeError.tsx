import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Mutunachi } from '../Mutunachi/Mutunachi';
import { AspectRatio, AspectRatioProps } from '../AspectRatio';
import { colors, minMediaQuery } from 'src/theme';

const errorsMap = {
  resourceNotFound: {
    title: `404 Error`,
    description: `What you're looking for isn't here, but hey – Keep Looking?!`,
    mid: '5',
  },
  genericError: {
    title: 'Ooops. Something went wrong!',
    description: `I'm not sure what to advice. Hmm – Try Again?!`,
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
        <div className={cls.textContainer}>
          <h1 className={cls.title}>{errorsMap[errorType].title}</h1>
          <h3 className={cls.description}>{errorsMap[errorType].description}</h3>
        </div>
      )}
    </div>
  );
};



const useStyles = createUseStyles({
  container: {
    width: '100%',
    textAlign: 'center',
    fontSize: '24px',

    ...minMediaQuery(600, {
      fontSize: '48px',
    }),
  },
  mutunachiContainer: {
    width: '60%',
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
  textContainer: {
    padding: '16px',
  },
  title: {
    fontSize: '100%',
    marginBottom: 0,
    color: colors.neutralDarker,
  },
  description: {
    fontSize: '50%',
    color: colors.neutralDarker,
    fontWeight: 400,
  }
});
