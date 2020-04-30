import React, { useState } from 'react';
import cx from 'classnames';
import { createUseStyles } from '../../lib/jss';

export const LobbyJoinCreatePop = () => {
  const styles = useStyle();
  const [joinMouseOver, joinSetMouseOver] = useState<boolean | undefined>(false);
  const [startMouseOver, startSetMouseOver] = useState<boolean | undefined>(false);
  return (
    <div className={styles.container}>
      <div
        className={cx(styles.createButton, {
          [styles.buttonMouseOver]: startMouseOver,
        })}
        onMouseOver={() => startSetMouseOver(true)}
        onFocus={() => startSetMouseOver(true)}
        onMouseOut={() => startSetMouseOver(false)}
        onBlur={() => startSetMouseOver(false)}
      >
        <div className={styles.buttonLabel}>CREATE</div>
      </div>
      <div style={{ width: '20px' }} />
      <div
        className={cx(styles.joinButton, {
          [styles.buttonMouseOver]: joinMouseOver,
        })}
        onMouseOver={() => joinSetMouseOver(true)}
        onFocus={() => joinSetMouseOver(true)}
        onMouseOut={() => joinSetMouseOver(false)}
        onBlur={() => joinSetMouseOver(false)}
      >
        <div className={styles.buttonLabel}>JOIN</div>
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
  joinButton: {
    backgroundColor: '#54C4F2',
    boxShadow: '1px 1px 15px rgba(20, 20, 20, 0.27)',
    borderRadius: '3px',
    minWidth: '159.2px',
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#08D183',
    boxShadow: '1px 1px 15px rgba(20, 20, 20, 0.27)',
    borderRadius: '3px',
    minWidth: '159.2px',
    textAlign: 'center',
  },
  buttonMouseOver: {
    backgroundColor: '#D4424C',
    cursor: 'pointer',
  },
  buttonLabel: {
    fontFamily: 'Roboto',
    fontWeight: 'lighter',
    fontSize: '21px',
    lineHeight: '28px',
    color: '#FFFFFF',
    padding: '15px 42px',
  },
});
