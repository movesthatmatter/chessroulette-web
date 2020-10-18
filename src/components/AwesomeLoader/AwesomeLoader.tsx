import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { useInterval } from 'src/lib/hooks';
import { getRandomInt } from 'src/lib/util';
import { Mutunachi } from '../Mutunachi/Mutunachi';
import { AspectRatio, AspectRatioProps } from '../AspectRatio';
import { Box, Text } from 'grommet';
import cx from 'classnames';

type Props = AspectRatioProps & {
  minimal?: boolean;
};

const now = () => (new Date()).getTime();

const sayings = [
  'Loading...',

  'Jumping through many hoops to connect you',
  'Hold on a second Mister!',
  'Tired of waiting?! Here we goooooo....Oops :)',
  'Look at that pretty face',
  'Don\'t worry. We\'ll be there in a jiffy',
  'Gotta\' make\'em wait ;)',
  'Establishing connection...',
];

const getRandomSaying = () => sayings[getRandomInt(0, sayings.length - 1)];

export const AwesomeLoader: React.FC<Props> = ({
  aspectRatio = { width: 1, height: 1 },
  minimal,
}) => {
  const cls = useStyles();
  const [randomKey, setRandomKey] = useState(now());

  useInterval(() => {
    setRandomKey(now());
  }, 2 * 1000);

  return (
    <div className={cls.container}>
      <AspectRatio
        aspectRatio={aspectRatio}
        className={cls.mutunachiContainer}
        key={randomKey}
      >
        <Mutunachi
          random
          className={cx([
            cls.mutunachi,
            minimal && cls.animatedMutunachi,
          ])}
        />
      </AspectRatio>
      {minimal || (
        <Box pad="small">
          <Text className={cls.text}>
            {getRandomSaying()}
          </Text>
        </Box>
      )}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    width: '100%',
    textAlign: 'center',
  },
  mutunachiContainer: {
    width: '60%',
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
  text: {
    fontFamily: 'Roboto',
    fontSize: '18px',
    fontWeight: 'normal',

    animation: '2s infinite',
    animationName: '$pulse',
  },

  animatedMutunachi: {
    animation: '2s infinite',
    animationName: '$pulse',
  }
});
