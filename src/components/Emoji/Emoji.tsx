import React from 'react';

type Props = {
  symbol: string;
  label?: string;
};

export const Emoji: React.FC<Props> = (props) => (
  <span
    className="emoji"
    role="img"
    aria-label={props.label ? props.label : ''}
    aria-hidden={props.label ? 'false' : 'true'}
  >
    {props.symbol}
  </span>
);
