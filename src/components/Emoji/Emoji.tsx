import React from 'react';

type Props = React.HTMLProps<HTMLSpanElement> & {
  symbol: string;
  label?: string;
};

export const Emoji: React.FC<Props> = ({ label, symbol, ...props }) => (
  <span
    className="emoji"
    role="img"
    aria-label={label ? label : ''}
    aria-hidden={label ? 'false' : 'true'}
    {...props}
  >
    {symbol}
  </span>
);
