import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Mutunachi } from '../Mutunachi/Mutunachi';
import { AspectRatio, AspectRatioProps } from '../AspectRatio';
import { colors, fonts, minMediaQuery } from 'src/theme';
import { Dialog } from '../Dialog';

const errorsMap = {
  resourceNotFound: {
    title: `Missing In Action`,
    description: `What you're looking for isn't here, but hey – Keep Looking?!`,
    mid: '5',
  },
  genericError: {
    title: 'Ooops. Something went wrong!',
    description: `I'm not sure what to advice. Hmm – Try Again?!`,
    mid: '3',
  },
  missingChallengeError: {
    title: `Ooops, it looks like the challenge doesn't exist anymore!`,
    description: 'Why not create a new challenge?',
    mid: '5',
  },
};
type Props =
  | {
      popup?: undefined;
    }
  | {
      popup: true;
      onClear: () => void;
    };

export type AwesomeErrorProps = AspectRatioProps & {
  minimal?: boolean;
  errorType?: keyof typeof errorsMap;
} & Props;

export const AwesomeError: React.FC<AwesomeErrorProps> = ({
  aspectRatio = { width: 1, height: 1 },
  minimal,
  errorType = 'genericError',
  ...props
}) => {
  const cls = useStyles();
  if (props.popup) {
    return (
      <div className={cls.container}>
        <Dialog
          hasCloseButton={false}
          visible
          buttons={[
            {
              label: 'Ok',
              type: 'primary',
              onClick: props.onClear,
            },
          ]}
          content={
            <div>
              <Mutunachi
                mid={errorsMap[errorType].mid}
                style={{ maxHeight: '200px', marginBottom: '10px' }}
              />
              <div style={{ textAlign: 'center' }}>
                <div className={cls.title} style={{ marginBottom: '10px' }}>
                  {errorsMap[errorType].title}
                </div>
                <div style={{ color: colors.neutralDarker, ...fonts.body2 }}>
                  {errorsMap[errorType].description}
                </div>
              </div>
            </div>
          }
        />
      </div>
    );
  }
  return (
    <div className={cls.container}>
      <AspectRatio aspectRatio={aspectRatio} className={cls.mutunachiContainer}>
        <Mutunachi mid={errorsMap[errorType].mid} className={cls.mutunachi} />
      </AspectRatio>
      {minimal || (
        <div className={cls.textContainer}>
          <h4 className={cls.title}>{errorsMap[errorType].title}</h4>
          <h6 className={cls.description}>{errorsMap[errorType].description}</h6>
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
  textContainer: {
    padding: '16px',
  },
  title: {
    marginBottom: 0,
    color: colors.neutralDarker,
  },
  description: {
    fontSize: '50%',
    color: colors.neutralDarker,
    fontWeight: 400,
  },
});
