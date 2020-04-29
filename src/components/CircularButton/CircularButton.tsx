import React, { useState } from 'react';
import cx from 'classnames';
import { createUseStyles } from 'src/lib/jss';
import VideoIconSVG from './assets/video.svg';
import ChatIconSVG from './assets/message-circle.svg';
import PlayIconSVG from './assets/play-circle.svg';


const ButtonTypes = {
  video: VideoIconSVG,
  chat: ChatIconSVG,
  play: PlayIconSVG,
};

export type Props = {
  type: keyof typeof ButtonTypes;
  color: string;
  onClick: () => void;
};

export const CircularButton: React.FC<Props> = (props) => {
  const cls = useStyle();
  const [mouseOver, setMouseOver] = useState<boolean | undefined>(false);

  return (
    <div
      className={cx(cls.button, {
        [cls.buttonWithMouseOver]: mouseOver,
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
    boxShadow:
      '0px 4px 4px rgba(0, 0, 0, 0.25), inset: 0px 0px 7px rgba(0, 0, 0, 0.42)',
    borderRadius: '36px',
    padding: '14px 16px;',
    display: 'inline-flex',
  },
  buttonWithMouseOver: {
    filter: 'brightness(110%)',
    cursor: 'pointer',
    transform: 'scale(1.05)',
  },
});
