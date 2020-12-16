/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { Button } from 'src/components/Button';
import { useWillUnmount } from './useWillUnmount';

const Component: React.FC = () => {
  const [color, setColor] = useState<string>('');
  useWillUnmount(() => {
    console.log('What is the color at umount:', color ? color : 'NOT SET');
  }, [color]);

  return (
    <>
      <Button label="Set Color to Red" type="negative" onClick={() => setColor('red')} />
      <Button label="Set Color to Yelow" type="attention" onClick={() => setColor('yellow')} />
      <code>Color: {color}</code>
    </>
  );
};

export default {
  component: Component,
  title: 'hooks/useWillUnmount',
};

export const withDeps = () =>
  React.createElement(() => {
    const [show, setShow] = useState(false);

    return (
      <>
        <Button label={show ? 'Hide' : 'Show'} onClick={() => setShow(!show)} />
        {show && <Component />}
      </>
    );
  });
