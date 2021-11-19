import { action } from '@storybook/addon-actions';
import { addSeconds } from 'date-fns/esm';
import { toISODateTime } from 'io-ts-isodatetime';
/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from 'react';
import { days, seconds } from 'src/lib/time';
import { console, Date } from 'window-or-global';
import { Text } from '../Text';
import { AwesomeCountdown } from './AwesomeCountdown';
import { timeLeftToTimeUnits } from './util';

export default {
  component: AwesomeCountdown,
  title: 'components/AwesomeCountdown',
};

// const deadline = toISODateTime(new Date('20 November 2021 13:00:00'));
const deadline = toISODateTime(addSeconds(new Date(), 3.9));

// console.log(timeLeftToTimeUnits(addSeconds(new Date(), 10).getTime() - new Date().getTime()));

export const defaultStory = () => (
  <div style={{ width: 400 }}>
    <Text>{deadline}</Text>
    <br />
    <br />
    <AwesomeCountdown
      deadline={toISODateTime(addSeconds(new Date(), 10))}
      onTimeEnded={action('time ended')}
    />
  </div>
);

export const withMultiple = () =>
  React.createElement(() => {
    const [deadlines, setDeadline] = useState([
      toISODateTime(addSeconds(new Date(), 4)),
      toISODateTime(addSeconds(new Date(), 10)),
    ]);

    const [currentDeadline, setCurrentDeadline] = useState(0);

    useEffect(() => {
      console.log('currentDeadline', currentDeadline);
      console.log('deadlines[currentDeadline]', deadlines[currentDeadline]);
    }, [currentDeadline]);

    return (
      <div style={{ width: 400 }}>
        <Text>{deadline}</Text>
        <br />
        <br />
        {
          <AwesomeCountdown
            deadline={deadlines[currentDeadline]}
            onTimeEnded={() => {
              action('time ended');

              // setDeadline((prev) => )
              setCurrentDeadline((prev) => prev + 1);
            }}
          />
        }
      </div>
    );
  });
