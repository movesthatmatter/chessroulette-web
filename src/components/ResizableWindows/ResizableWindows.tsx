import React, { useState } from 'react';
import cx from 'classnames';
import { createUseStyles } from 'src/lib/jss';


type Props = {
  load: boolean;
  background: 'light' | 'dark';
  children? : React.ReactNode;
}
type userType = {
  loaded: boolean;
}
type usersType = {
  [key: string]: userType;
}
const users: usersType = {
  user1: {
    loaded: false,
  },
  user2: {
    loaded: false,
  },
  user3: {
    loaded: false,
  },
  user4: {
    loaded: false,
  },
};
enum BackgroundType {
  dark = 'dark',
  light = 'light'
}

// Selector only used for testing, can remove this once component is in usage
type SelectorProps = {
  inputChange: (value: string) => void;
}

export const ResizableWindow = ({ load, background, children }: Props) => {
  const styles = useStyles();
  return (
    <div className={cx(styles.screen, {
      [styles.screenDefaultSize]: !load,
      [styles.screenContentLoadedSize]: load,
      [styles.screenLightBG]: background === 'light',
      [styles.screenDarkBG]: background === 'dark',
    })}
    >
      {children}
    </div>
  );
};

export const ResizableWindows = () => {
  const [usersStatus, setUsersStatus] = useState<usersType>({ ...users });
  const styles = useStyles();
  return (
    <>
      <div className={styles.container}>
        <div className={styles.screensContainer}>
          <div className={styles.leftSide}>
            <ResizableWindow load={usersStatus.user1.loaded} background={BackgroundType.dark} />
            <ResizableWindow load={usersStatus.user2.loaded} background={BackgroundType.light} />
          </div>
          <div className={styles.rightSide}>
            <ResizableWindow load={usersStatus.user3.loaded} background={BackgroundType.light} />
            <ResizableWindow load={usersStatus.user4.loaded} background={BackgroundType.dark} />
          </div>
        </div>
      </div>
      <div className={styles.controls}>
        <Selector
          inputChange={(value: string) => {
            Object.keys(users).reduce((acc, user) => {
              if (Object.keys(users).indexOf(user) <= Number(value) - 1) {
                users[user].loaded = true;
              } else {
                users[user].loaded = false;
              }
              setUsersStatus({ ...users });
              return acc;
            }, {});
          }}
        />
      </div>
    </>
  );
};

// this is only gonna be used for testing - remove this function when using the component!!
const Selector = (props: SelectorProps) => (
  <div>
    <div style={{ marginRight: '20px' }}>Users Loaded</div>
    <input
      type="number"
      defaultValue="0"
      min="0"
      max="4"
      onChange={(event) => props.inputChange(event.target.value)}
    />
  </div>
);


const useStyles = createUseStyles({
  screen: {
    transition: 'all .5s ease-in-out',
  },
  screenDefaultSize: {
    width: '30px',
    height: '34px',
  },
  screenContentLoadedSize: {
    width: '236px',
    height: '262px',
  },
  screenLightBG: {
    backgroundColor: '#D4F1F5',
  },
  screenDarkBG: {
    backgroundColor: '#94E2E4',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  screensContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  controls: {
    position: 'absolute',
    top: '600px',
    display: 'flex',
    width: '200px',
  },
  leftSide: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  rightSide: {
    display: 'flex',
    flexDirection: 'column',
  },
});
