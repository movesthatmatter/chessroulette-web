import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { CustomTheme, effects } from 'src/theme';
import { useLightDarkMode } from 'src/theme/hooks/useLightDarkMode';
import cx from 'classnames';
import { Sun, Moon } from 'grommet-icons';

type Props = {};

export const DarkModeSwitch: React.FC<Props> = (props) => {
  const cls = useStyles();
  const {theme, switchTheme} = useLightDarkMode();

  return (
    <div className={cls.container}>
      <div className={cls.darkRoomSwitcher}>
        <div className={cls.toggleButton} 
          onClick={() => switchTheme()}
        >
        <div className={cx(cls.switch,{
          [cls.switchOn] : theme === 'light',
          [cls.switchOff] : theme === 'dark'
        })}>
          {theme === 'light' ? <Sun className={cls.iconSun}/> : <Moon className={cls.iconMoon}/>}
        </div>
        </div>
      </div>
    </div>
  );
};

const useStyles = createUseStyles<CustomTheme>(theme => ({
  container: {
    display:'flex',
    width: 'fit-contents'
  },
  darkRoomSwitcher: {
  },
  switch: {
    width:'20px',
    height:'20px',
    borderRadius: '50%',
    backgroundColor: theme.colors.black,
    position: 'relative',
    transition: 'inherit',
    ...effects.floatingShadow,
    display:'flex',
    justifyContent:'center',
    alignContent:'center',
    alignItems:'center',
  },
  switchOn:{
    transform: 'translateX(20px)'
  },
  switchOff:{
    transform: 'translateX(0)',
  },
  toggleButton: {
    width:'40px',
    height:'20px',
    // border: '2px solid black',
    ...effects.borderRadius,
    margin: '0 auto',
    padding: '2px',
    backgroundColor: theme.colors.neutral,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s linear'
  },
  iconSun:{
    fill: `${theme.colors.white} !important`,
    color: `${theme.colors.white} !important`,
    width:'15px !important',
    height:'15px !important'
  },
  iconMoon: {
    fill: `${theme.colors.white} !important`,
    color: `${theme.colors.white} !important`,
    width:'15px !important',
    height:'15px !important'
  }
}));