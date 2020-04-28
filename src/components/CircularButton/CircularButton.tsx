/* eslint-disable global-require */
import React, { useState } from 'react';
import './CircularButton.css';
import { createUseStyles } from 'react-jss';
import cx from 'classnames';

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
  const classes = useStyle();
  const [mouseOver, setMouseOver] = useState<boolean | undefined>(false);

  return (
    <div
      className={cx(classes.button, {
        [classes.buttonWithMouseOver]: mouseOver,
      })}
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

const useStyle = createUseStyles({
  button: {
    'box-shadow':
      '0px 4px 4px rgba(0, 0, 0, 0.25), inset: 0px 0px 7px rgba(0, 0, 0, 0.42)',
    'border-radius': '36px',
    padding: '20px 25px',
    display: 'inline-flex',
  },
  buttonWithMouseOver: {
    '-webkit-filter': 'brightness(110%)',
    filter: 'brightness(110%)',
    cursor: 'pointer',
    transform: 'scale(1.05)',
  },
});
