import React from 'react';
import { Text } from 'src/components/Text';
import { createUseStyles, makeImportant, NestedCSSElement } from 'src/lib/jss';
import { fonts, maxMediaQuery, onlyMobile } from 'src/theme';
import cx from 'classnames';

type Props = {
  timeLeft: number;
  canShowMilliseconds: boolean;
  active: boolean;
  major: string;
  minor: string;
  thumbnail?: boolean;
};

export const CountdownDisplay: React.FC<Props> = ({
  timeLeft,
  active,
  canShowMilliseconds,
  major,
  minor,
  ...props
}) => {
  const cls = useStyles();

  if (timeLeft > 0) {
    return (
      <Text className={cls.text}>
        <Text
          className={cx(
            cls.text,
            cls.major,
            active && cls.textActive,
            canShowMilliseconds && cls.countdownMilliseconds
          )}
          style={{... (props.thumbnail ? {...fonts.largeNormal} : {...fonts.hugeNormal})}}
        >
          {major}
        </Text>
        <Text
          className={cx(
            cls.text,
            cls.major,
            active && (cls.textActive, cls.blink),
            canShowMilliseconds && cls.countdownMilliseconds
          )}
          style={{... (props.thumbnail ? {...fonts.largeNormal} : {...fonts.hugeNormal})}}
        >
          :
        </Text>
        <Text
          className={cx(
            cls.text,
            cls.minor,
            active && cls.textActive,
            canShowMilliseconds && cls.countdownMilliseconds
          )}
          style={{... (props.thumbnail ? {...fonts.largeNormal} : {...fonts.hugeNormal})}}
        >
          {minor}
        </Text>
      </Text>
    );
  }

  return (
    <Text className={cx(cls.text, cls.countdownMilliseconds)} style={{... (props.thumbnail ? {...fonts.largeNormal} : {...fonts.hugeNormal})}}>
      <Text className={cx(cls.text, cls.major, cls.countdownMilliseconds)} style={{... (props.thumbnail ? {...fonts.largeNormal} : {...fonts.hugeNormal})}}>00:</Text>
      <Text className={cx(cls.text, cls.minor, cls.countdownMilliseconds)} style={{... (props.thumbnail ? {...fonts.largeNormal} : {...fonts.hugeNormal})}}>00</Text>
    </Text>
  );
};

const useStyles = createUseStyles((theme) => ({
  text: {
    color: theme.text.subtle,
    ...maxMediaQuery(1300, {
      fontSize: '24px',
      lineHeight: '24px',
    }),
    ...onlyMobile({
      fontSize: '24px',
      lineHeight: '24px',
    }),
  },
  textActive: {
    color: theme.text.baseColor,
  },
  major: {
    fontWeight: 700,
  },
  minor: {
    fontWeight: 300,
  },
  paused: {},
  countdownMilliseconds: {
    ...makeImportant({
      color: theme.colors.negative,
    }),
  },
  blink: {
    animation: '$blink 1s steps(5, start) infinite',
    color: theme.text.primaryColor,
  },
  '@keyframes blink': {
    ...({
      to: {
        visibility: 'hidden',
      },
    } as NestedCSSElement),
  },
}));
