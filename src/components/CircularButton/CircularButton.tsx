/* eslint-disable global-require */
import React, { useState } from 'react';
import './CircularButton.css';

const ButtonTypes = {
  video: require('./assets/video.svg'),
  chat: require('./assets/message-circle.svg'),
  play: require('./assets/play-circle.svg'),
};

export type Props = {
  type: keyof typeof ButtonTypes;
  color: string;
  onClick: () => void;
};

export const CircularButton: React.FC<Props> = (props) => {
  const [mouseOver, setMouseOver] = useState<boolean | undefined>(false);
  const btnStyle: Array<string> = ['button'];

  if (mouseOver) {
    btnStyle.push('mouseOver');
  }

  return (
    <div
      className={btnStyle.join(' ')}
      style={{ background: props.color }}
      onMouseOver={() => setMouseOver(true)}
      onFocus={() => setMouseOver(true)}
      onMouseOut={() => setMouseOver(false)}
      onBlur={() => setMouseOver(false)}
      onClick={props.onClick}
    >
      <img src={ButtonTypes[props.type]} alt="buttonLabel" />
    </div>
  );
};
