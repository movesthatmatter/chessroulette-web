import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { useInterval } from 'src/lib/hooks';
import { getRandomInt } from 'src/lib/util';
import { Mutunachi } from '../Mutunachi/Mutunachi';

type Props = {};

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

export const AwesomeLoader: React.FC<Props> = (props) => {
  const cls = useStyles();
  const [randomKey, setRandomKey] = useState(now());

  useInterval(() => {
    setRandomKey(now());
  }, 2 * 1000);

  return (
    <div
      className={cls.container}
      key={randomKey}
    >
      <div className={cls.mutunachiContainer}>
        <Mutunachi
          random
          className={cls.mutunachi}
        />
      </div>
      <div className={cls.text}>{getRandomSaying()}</div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    width: '300px',
    paddingTop: '200px',
    textAlign: 'center',
  },
  mutunachiContainer: {
    width: '180px',
    background: 'red',
    margin: '0 auto',
    position: 'relative',
  },
  mutunachi: {
    width: '180px',
    display: 'inline',
    animation: 'pulse 3s infinite',

    position: 'absolute',
    bottom: 0,
    left: '-50%',
    transform: 'translateX(50%)',
  },

  '@keyframes pulse': {
    '0%': {
      opacity: 0.95,
    },

    '50%': {
      opacity: 0.3,
    },
  },
  text: {
    fontFamily: 'Roboto',
    fontSize: '18px',
    fontWeight: 'normal',

    animation: '2s infinite',
    animationName: '$pulse',

    marginTop: '30px',
  },
});
