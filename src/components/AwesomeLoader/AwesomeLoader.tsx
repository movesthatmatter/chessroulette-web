import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { useInterval } from 'src/lib/hooks';
import { getRandomInt, range, shuffle } from 'src/lib/util';
import { Mutunachi } from '../Mutunachi/Mutunachi';
import { AspectRatio } from '../AspectRatio';
import { Text } from 'src/components/Text';
import cx from 'classnames';
import { colors, effects } from 'src/theme';

type Props = {
  minimal?: boolean;
  size?: string | number;
};

const sayings = [
  'Loading...',

  'Jumping through many hoops',
  'Hold on a second Mister!',
  'Tired of waiting?! Here we goooooo 😀',
  'Look at that pretty face',
  "Don't worry. We'll be there in a jiffy",
  "Gotta' make'em wait 😉",
  'Establishing connection...',
];

const getRandomSaying = () => sayings[getRandomInt(0, sayings.length - 1)];

const shuffleMids = () => shuffle(range(18, 0));

export const AwesomeLoader: React.FC<Props> = ({ size = 200, minimal }) => {
  const cls = useStyles();
  const [shuffled, setShuffled] = useState(shuffleMids());
  const [index, setIndex] = useState(0);

  useInterval(() => {
    if (index < shuffled.length - 1) {
      setIndex(index + 1);
    } else {
      setShuffled(shuffleMids);
      setIndex(0);
    }
  }, 2000);

  return (
    <div className={cls.container}>
      <div className={cls.mask} style={{ width: size }}>
        <AspectRatio aspectRatio={1}>
          <div className={cls.animationBox}>
            <div className={cls.mutunachiContainer}>
              <Mutunachi mid={shuffled[index]} className={cx([cls.mutunachi, minimal])} />
            </div>
          </div>
        </AspectRatio>
      </div>
      {minimal || <Text className={cls.text}>{getRandomSaying()}</Text>}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    width: '100%',
    textAlign: 'center',
  },
  mask: {
    margin: '0 auto',
    overflow: 'hidden',
    background: `linear-gradient(top, ${colors.primaryLight} 100%, #fff 0%)`,
    position: 'relative',
    borderRadius: '50%',
    marginBottom: '16px',
    ...effects.floatingShadow,
    zIndex: 999,
  },
  animationBox: {
    width: '300%',
    marginLeft: '-100%',
    position: 'relative',
    zIndex: 990,
  },

  reel: {
    display: 'flex',
  },
  mutunachiContainer: {
    width: '33.33%',
    transform: 'translateX(200%)',
    animation: '2000ms ease-in-out infinite',
    animationName: '$snapLeft',
  },
  mutunachi: {
    width: '70%',
    paddingTop: '30%',
    paddingLeft: '15%',
  },
  '@keyframes snapLeft': {
    '0%': {
      transform: 'translateX(200%)',
    },
    '25%': {
      transform: 'translateX(100%)',
    },
    '75%': {
      transform: 'translateX(100%)',
    },
    '100%': {
      transform: 'translateX(0%)',
    },
  },
  text: {
    fontSize: '14px',
  },
});
