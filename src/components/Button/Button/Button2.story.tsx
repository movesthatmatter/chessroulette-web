import { action } from '@storybook/addon-actions';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Button } from './Button2';
import { Dashboard, Group, Save, Tape, ObjectGroup, Key } from 'grommet-icons';
import { delay } from 'src/lib/time';

export default {
  component: Button,
  title: 'components/Button/Button2',
};

export const defaultStory = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
    }}
  >
    <div
      style={{
        width: '150px',
      }}
    >
      <h4>Basic</h4>
      <Button label="Default" onClick={action('clicked')} />
      <Button label="Positive" type="positive" onClick={action('clicked')} />
      <Button label="Negative" type="negative" onClick={action('clicked')} />
      <Button label="Primary" type="primary" onClick={action('clicked')} />
      <Button label="Secondary" type="secondary" onClick={action('clicked')} />
      <Button label="Attention" type="attention" onClick={action('clicked')} />
      <Button label="Disabled" disabled onClick={action('clicked')} />
    </div>
    <div
      style={{
        width: '150px',
      }}
    >
      <h4>Clear</h4>
      <Button label="Clear Default" clear onClick={action('clicked')} />
      <Button label="Clear Positive" type="positive" clear onClick={action('clicked')} />
      <Button label="Clear Negative" type="negative" clear onClick={action('clicked')} />
      <Button label="Clear Primary" clear onClick={action('clicked')} />
      <Button label="Secondary" type="secondary" clear onClick={action('clicked')} />
      <Button label="Clear Attention" type="attention" clear onClick={action('clicked')} />
      <Button label="Clear Attention" disabled clear onClick={action('clicked')} />
    </div>
    <div
      style={{
        width: '150px',
      }}
    >
      <h4>Fully Stretched</h4>
      <Button label="Clear Default" full onClick={action('clicked')} />
      <Button label="Clear Positive" type="positive" full onClick={action('clicked')} />
      <Button label="Clear Negative" type="negative" full clear onClick={action('clicked')} />
      <Button label="Clear Primary" type="primary" full onClick={action('clicked')} />
      <Button label="Secondary" type="secondary" full onClick={action('clicked')} />
      <Button label="Clear Attention" type="attention" full onClick={action('clicked')} />
      <Button label="Clear Attention" disabled clear full onClick={action('clicked')} />
    </div>
    <div
      style={{
        marginLeft: '16px',
        width: '150px',
      }}
    >
      <h4>With Icon</h4>
      <Button label="Default" icon={Dashboard} onClick={action('clicked')} />
      <Button label="Positive" type="positive" icon={Tape} onClick={action('clicked')} />
      <Button label="Negative" type="negative" icon={ObjectGroup} onClick={action('clicked')} />
      <Button label="Primary" type="primary" icon={Group} onClick={action('clicked')} />
      <Button label="Secondary" type="secondary" icon={Tape} onClick={action('clicked')} />
      <Button label="Attention" type="attention" icon={Save} onClick={action('clicked')} />
      <Button label="Disabled" disabled icon={Key} onClick={action('clicked')} />
    </div>
    <div
      style={{
        marginLeft: '16px',
        width: '200px',
      }}
    >
      <h4>With Icon Reversed</h4>
      <Button label="Default" icon={Dashboard} reverse onClick={action('clicked')} />
      <Button label="Positive" type="positive" reverse icon={Tape} onClick={action('clicked')} />
      <Button
        label="Negative"
        type="negative"
        reverse
        icon={ObjectGroup}
        onClick={action('clicked')}
      />
      <Button label="Primary" type="primary" reverse icon={Group} onClick={action('clicked')} />
      <Button
        label="Secondary"
        type="secondary"
        reverse
        icon={ObjectGroup}
        onClick={action('clicked')}
      />
      <Button label="Attention" type="attention" reverse icon={Save} onClick={action('clicked')} />
      <Button label="Disabled" disabled icon={Key} reverse onClick={action('clicked')} />
    </div>
    <div
      style={{
        width: '150px',
      }}
    >
      <h4>Full With Icon</h4>
      <Button label="Default" icon={Dashboard} full onClick={action('clicked')} />
      <Button label="Positive" type="positive" full icon={Tape} onClick={action('clicked')} />
      <Button
        label="Negative"
        type="negative"
        full
        icon={ObjectGroup}
        onClick={action('clicked')}
      />
      <Button label="Primary" type="primary" full icon={Group} onClick={action('clicked')} />
      <Button
        label="Secondary"
        type="secondary"
        full
        icon={ObjectGroup}
        onClick={action('clicked')}
      />
      <Button label="Attention" type="attention" full icon={Save} onClick={action('clicked')} />
      <Button label="Disabled" disabled full icon={Key} onClick={action('clicked')} />
    </div>
    <div
      style={{
        width: '150px',
        marginLeft: '16px',
      }}
    >
      <h4>Clear With Icon</h4>
      <Button label="Default" icon={Dashboard} clear onClick={action('clicked')} />
      <Button label="Positive" type="positive" clear icon={Tape} onClick={action('clicked')} />
      <Button
        label="Negative"
        type="negative"
        clear
        icon={ObjectGroup}
        onClick={action('clicked')}
      />
      <Button label="Primary" type="primary" clear icon={Group} onClick={action('clicked')} />
      <Button label="Secondary" type="secondary" clear icon={Group} onClick={action('clicked')} />
      <Button label="Attention" type="attention" clear icon={Save} onClick={action('clicked')} />
      <Button label="Disabled" disabled clear icon={Key} onClick={action('clicked')} />
    </div>
    <div
      style={{
        width: '150px',
        marginLeft: '16px',
      }}
    >
      <h4>Small Sized</h4>

      <Button label="Default" icon={Dashboard} size="small" clear onClick={action('clicked')} />

      <Button
        label="Positive"
        type="positive"
        size="small"
        icon={Tape}
        onClick={action('clicked')}
      />

      <Button
        label="Negative"
        type="negative"
        size="small"
        icon={ObjectGroup}
        onClick={action('clicked')}
      />
      <Button
        label="Primary"
        type="primary"
        clear
        size="small"
        icon={Group}
        onClick={action('clicked')}
      />
      <Button
        label="Secondary"
        type="secondary"
        clear
        size="small"
        icon={Group}
        onClick={action('clicked')}
      />
      <Button label="Attention" type="attention" size="small" onClick={action('clicked')} />
      <Button label="Disabled" disabled size="small" icon={Key} onClick={action('clicked')} />
    </div>
    <div
      style={{
        width: '200px',
        marginLeft: '16px',
      }}
    >
      <h4>Medium Sized</h4>

      <Button label="Default" icon={Dashboard} size="medium" clear onClick={action('clicked')} />

      <Button
        label="Positive"
        type="positive"
        size="medium"
        icon={Tape}
        onClick={action('clicked')}
      />
      <Button
        label="Negative"
        type="negative"
        size="medium"
        icon={ObjectGroup}
        onClick={action('clicked')}
      />
      <Button
        label="Primary"
        type="primary"
        clear
        size="medium"
        icon={Group}
        onClick={action('clicked')}
      />
      <Button
        label="Secondary"
        type="secondary"
        clear
        size="medium"
        icon={Group}
        onClick={action('clicked')}
      />
      <Button label="Attention" type="attention" size="medium" onClick={action('clicked')} />
      <Button label="Disabled" disabled size="medium" icon={Key} onClick={action('clicked')} />
    </div>
    <div
      style={{
        width: '250px',
        marginLeft: '16px',
      }}
    >
      <h4>Large Sized</h4>
      <Button label="Default" icon={Dashboard} size="large" clear onClick={action('clicked')} />
      <Button
        label="Positive"
        type="positive"
        size="large"
        icon={Tape}
        onClick={action('clicked')}
      />
      <Button
        label="Negative"
        type="negative"
        size="large"
        icon={ObjectGroup}
        onClick={action('clicked')}
      />
      <Button
        label="Primary"
        type="primary"
        clear
        size="large"
        icon={Group}
        onClick={action('clicked')}
      />
      <Button
        label="Secondary"
        type="secondary"
        clear
        size="large"
        icon={Group}
        onClick={action('clicked')}
      />
      <Button label="Attention" type="attention" size="large" onClick={action('clicked')} />
      <Button label="Disabled" disabled size="large" icon={Key} onClick={action('clicked')} />
    </div>
    <div
      style={{
        width: '200px',
        marginLeft: '16px',
      }}
    >
      <h4>With Loader</h4>
      <Button
        label="Basic"
        withLoader
        onClick={() => {
          action('clicked');

          return delay(2000);
        }}
      />
      <Button
        label="Full With Icon"
        type="positive"
        full
        withLoader
        icon={Tape}
        onClick={() => {
          action('clicked');

          return delay(2000);
        }}
      />
      <Button
        label="Full"
        type="negative"
        size="medium"
        full
        withLoader
        onClick={() => {
          action('clicked');

          return delay(2000);
        }}
      />
      <Button
        label="Clear With Icon"
        type="primary"
        clear
        size="medium"
        icon={Group}
        withLoader
        onClick={() => {
          action('clicked');

          return delay(2000);
        }}
      />
      <Button
        label="With Icon Rev"
        type="secondary"
        reverse
        size="medium"
        icon={Group}
        withLoader
        onClick={() => {
          action('clicked');

          return delay(2000);
        }}
      />
      <Button
        label="Attention"
        type="attention"
        size="medium"
        withLoader
        onClick={() => {
          action('clicked');

          return delay(2000);
        }}
      />
      <Button
        label="Disabled"
        disabled
        size="medium"
        icon={Key}
        withLoader
        onClick={() => {
          action('clicked');

          return delay(2000);
        }}
      />
    </div>
    <div
      style={{
        width: '200px',
        marginLeft: '16px',
      }}
    >
      <h4>With Loader as Clear</h4>
      <Button
        label="Basic"
        withLoader
        clear
        onClick={() => {
          action('clicked');

          return delay(2000);
        }}
      />
      <Button
        label="Full With Icon"
        type="positive"
        full
        clear
        withLoader
        icon={Tape}
        onClick={() => {
          action('clicked');

          return delay(2000);
        }}
      />
      <Button
        label="Full"
        type="negative"
        size="medium"
        full
        clear
        withLoader
        onClick={() => {
          action('clicked');

          return delay(2000);
        }}
      />
      <Button
        label="Clear With Icon"
        type="primary"
        clear
        size="medium"
        icon={Group}
        withLoader
        onClick={() => {
          action('clicked');

          return delay(2000);
        }}
      />
      <Button
        label="With Icon Rev"
        type="secondary"
        reverse
        clear
        size="medium"
        icon={Group}
        withLoader
        onClick={() => {
          action('clicked');

          return delay(2000);
        }}
      />
      <Button
        label="Attention"
        type="attention"
        size="medium"
        clear
        withLoader
        onClick={() => {
          action('clicked');

          return delay(2000);
        }}
      />
      <Button
        label="Disabled"
        disabled
        size="medium"
        icon={Key}
        withLoader
        clear
        onClick={() => {
          action('clicked');

          return delay(2000);
        }}
      />
    </div>
  </div>
);
