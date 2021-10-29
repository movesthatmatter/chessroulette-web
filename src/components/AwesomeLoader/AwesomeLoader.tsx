import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { useInterval } from 'src/lib/hooks';
import { getRandomInt, range, shuffle } from 'src/lib/util';
import { Mutunachi } from '../Mutunachi/Mutunachi';
import { AspectRatio } from '../AspectRatio';
import { Text } from 'src/components/Text';
import cx from 'classnames';
import { CustomTheme, effects } from 'src/theme';
import { seconds } from 'src/lib/time';

type Props = {
  minimal?: boolean;
  size?: string | number;
  sayings? : Array<string>;
  className? :string;
};

const defaultSayings = [
  'Loading...',

  'Jumping through many hoops',
  'Hold on a second Mister!',
  'Tired of waiting?! Here we goooooo 😀',
  'Look at that pretty face',
  "Don't worry. We'll be there in a jiffy",
  "Gotta' make'em wait 😉",
  'Establishing connection...',
];

const getRandomSaying = (s : Array<string>) => s[getRandomInt(0, s.length - 1)];

const shuffleMids = () => shuffle(range(18, 0));

const animationIntervalMs = seconds(3);

export const AwesomeLoader: React.FC<Props> = ({ sayings = defaultSayings, size = 200, minimal, className, }) => {
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
  }, animationIntervalMs);

  return (
    <div className={cx(cls.container, className)}>
      <div className={cls.mask} style={{ width: size }}>
        <AspectRatio aspectRatio={1}>
          <div className={cls.animationBox}>
            <div className={cls.mutunachiContainer}>
              <Mutunachi mid={shuffled[index]} className={cx([cls.mutunachi, minimal])} />
            </div>
          </div>
        </AspectRatio>
      </div>
      {minimal || <Text className={cls.text}>{getRandomSaying(sayings)}</Text>}
    </div>
  );
};

const useStyles = createUseStyles(theme => ({
  container: {
    width: '100%',
    textAlign: 'center',
  },
  mask: {
    margin: '0 auto',
    overflow: 'hidden',
    ...(theme.name === 'lightDefault' ? {
      background: `linear-gradient(top, ${theme.colors.primaryLight} 100%, #fff 0%)`
    }: {
      backgroundColor: '#7774CA'
    }),
    position: 'relative',
    borderRadius: '50%',
    marginBottom: '16px',
    ...effects.floatingShadow,
    zIndex: 1,
  },
  animationBox: {
    width: '300%',
    marginLeft: '-100%',
    position: 'relative',
  },

  reel: {
    display: 'flex',
  },
  mutunachiContainer: {
    width: '33.33%',
    transform: 'translateX(200%)',
    animation: `${animationIntervalMs}ms ease-in-out infinite`,
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
    '20%': {
      transform: 'translateX(100%)',
    },
    '80%': {
      transform: 'translateX(100%)',
    },
    '100%': {
      transform: 'translateX(0%)',
    },
  },
  text: {
    fontSize: '14px',
  },
}));
