import React from 'react';
import { FloatingBox } from 'src/components/FloatingBox';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { ISODateTime } from 'io-ts-isodatetime';
import { Text } from 'src/components/Text';
import { AwesomeCountdown } from 'src/components/AwesomeCountdown/AwesomeCountdown';
import { noop } from 'src/lib/util';
import { colors } from 'src/theme/colors';

type Props = {
  classname?: string;
  event: {
    name: string;
    startDate?: ISODateTime;
  };
  onCountdownTimeEnded?: (tickIntervalMs: number) => void;
};

export const EventPromo: React.FC<Props> = ({ onCountdownTimeEnded = noop, ...props }) => {
  const cls = useStyles();

  return (
    <FloatingBox className={cx(cls.container, props.classname)}>
      <Text size="title2" className={cls.text}>
        {props.event.name}
      </Text>
      {props.event.startDate && (
        <AwesomeCountdown
          deadline={props.event.startDate}
          fontSizePx={50}
          onTimeEnded={onCountdownTimeEnded}
          className={cls.countdownContainer}
        />
      )}
    </FloatingBox>
  );
};

const useStyles = createUseStyles({
  container: {
    backgroundImage: `linear-gradient(45deg, ${colors.light.primary} 0, ${colors.dark.primary} 150%)`,
  },
  countdownContainer: {
    color: colors.universal.white,
  },
  text: {
    color: colors.universal.white,
  }
});
