import React, { useState } from 'react';
import cx from 'classnames';
import { createUseStyles } from 'src/lib/jss';

type BtnProps = {
  label: string;
  color: string;
  onClickFunction: () => void;
  fontSize: string;
  padding? : string;
  width? : string;
}
export const ColoredButton = ({
  label,
  color,
  onClickFunction,
  fontSize,
  padding,
  width,
}: BtnProps) => {
  const styles = useStyle({ color });
  const [buttonOver, setButtonOver] = useState<boolean>(false);
  return (
    <div className={styles.container}>
      <div
        style={{ backgroundColor: color, width: `${width || ''}` }}
        className={cx(styles.button, {
          [styles.buttonMouseOver]: buttonOver,
        })}
        onMouseOver={() => setButtonOver(true)}
        onFocus={() => setButtonOver(true)}
        onMouseOut={() => setButtonOver(false)}
        onBlur={() => setButtonOver(false)}
        onClick={() => onClickFunction()}
      >
        <div
          style={{ padding: `${padding || '0px'}`, fontSize }}
          className={styles.buttonLabel}
        >
          {label}

        </div>
      </div>
    </div>
  );
};

const useStyle = createUseStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    transition: 'all .3s ease-in-out',
  },
  button: {
    boxShadow: '1px 1px 15px rgba(20, 20, 20, 0.27)',
    borderRadius: '3px',
    textAlign: 'center',
  },
  buttonMouseOver: {
    filter: 'brightness(110%)',
    cursor: 'pointer',
  },
  buttonLabel: {
    fontFamily: 'Roboto',
    fontWeight: 'lighter',
    lineHeight: '28px',
    color: '#FFFFFF',
  },
});
