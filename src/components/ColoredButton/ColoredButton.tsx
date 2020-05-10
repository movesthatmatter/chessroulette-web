import React from 'react';
import { createUseStyles } from 'src/lib/jss';

type BtnProps = {
  label: string;
  color?: string;
  onClickFunction: () => void;
  fontSize?: string;
  padding? : string;
  width? : string;
}
export const ColoredButton = ({
  label,
  onClickFunction,
  color = '#efefef',
  fontSize = '16',
  padding,
  width,
}: BtnProps) => {
  const styles = useStyle({ color });

  return (
    <div className={styles.container}>
      <div
        style={{ backgroundColor: color, width: `${width || ''}` }}
        className={styles.button}
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
    padding: '3px 10px',

    '&:hover': {
      filter: 'brightness(110%)',
      cursor: 'pointer',
    },
  },
  buttonLabel: {
    fontFamily: 'Roboto',
    fontWeight: 'lighter',
    lineHeight: '28px',
    color: '#FFFFFF',
  },
});
