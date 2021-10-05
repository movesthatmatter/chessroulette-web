import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { CustomTheme, effects, fonts } from 'src/theme';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import cx from 'classnames';
import { Sun, Moon } from 'grommet-icons';
import { Text } from '../Text';

type Props = {};

export const DarkModeSwitch: React.FC<Props> = (props) => {
  const cls = useStyles();
  const {themeName: theme, switchTheme} = useColorTheme();
  const [animate, setAnimate] = useState(0);
  return (
    <div className={cls.containerSwitch}>
      <div className={cls.darkRoomSwitcher}>
        {/* <Text style={{...fonts.small1, marginRight: '5px'}} className={cls.text}>Dark</Text> */}
        <div className={cls.toggleButton} 
          onClick={() => {
            setAnimate(1);
            switchTheme();
          }}
          onAnimationEnd={() => {
            setAnimate(0);
          }}
        >
        <div className={cx(cls.switch,{
           [cls.switchOn] : theme === 'light',
        }, (animate === 1 && theme === 'light') && cls.animateOn, (animate === 1 && theme === 'dark') && cls.animateOff )}>
          {/* {theme === 'light' ? <Sun className={cls.iconSun}/> : <Moon className={cls.iconMoon}/>} */}
        </div>
        <div className={cx(cls.switchMask,{
           [cls.maskOn] : theme === 'light',
        }, (animate === 1 && theme === 'light') && cls.animateMaskOn, (animate === 1 && theme === 'dark') && cls.animateMaskOff )}>
        </div>
        </div>
        {/* <Text style={{...fonts.small1, marginLeft: '5px'}} className={cls.text}>Light</Text> */}
      </div>
    </div>
  );
};

const useStyles = createUseStyles<CustomTheme>(theme => ({
  containerSwitch: {
    display:'flex',
    width: 'fit-contents'
  },
  darkRoomSwitcher: {
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    alignContent:'center',
    textAlign: 'center',
  },
  text:{
    color:theme.colors.text
  },
  switch: {
    width:'20px',
    height:'20px',
    borderRadius: '50%',
    backgroundColor: 'black',
    position: 'relative',
    ...effects.floatingShadow,
    display:'flex',
    justifyContent:'center',
    alignContent:'center',
    alignItems:'center',
    transition: 'all 0.3s cubic-bezier(1.000, 0.670, 0.350, 1.300)',
    transitionTimingFunction: 'cubic-bezier(1.000, 0.670, 0.350, 1.300)'
  },
  switchMask: {
    width:'20px',
    height:'20px',
    borderRadius: '50%',
    backgroundColor: theme.colors.neutral,
    position: 'absolute',
    top: '-3px',
    left: '11px',
    display:'flex',
    justifyContent:'center',
    alignContent:'center',
    alignItems:'center',
    transition: 'all 0.3s cubic-bezier(1.000, 0.670, 0.350, 1.300)',
    transitionTimingFunction: 'cubic-bezier(1.000, 0.670, 0.350, 1.300)'
  }, 
  '@keyframes animateOn': {
    '0%': {
      transform: 'translateX(0)'
    },
    '100%': {
      transform: 'translateX(100%)'
    }
  },
  '@keyframes animateOff': {
    '100%': {
      transform: 'translateX(0)'
    },
    '0%': {
      transform: 'translateX(100%)'
    }
  },
  '@keyframes animateMaskOn': {
    '0%': {
      transform: 'translateX(0)'
    },
    '100%': {
      transform: 'translateX(160%)'
    }
  },
  '@keyframes animateMaskOff': {
    '100%': {
      transform: 'translateX(0)'
    },
    '0%': {
      transform: 'translateX(160%)'
    }
  },
  animationOn: {
    animation: '$animateOn 0.3s',
  },
  animationOff :{
    animation: '$animateOff 0.3s'
  },
  animationMaskOn: {
    animation: '$animateMaskOn 0.3s',
  },
  animationMaskOff :{
    animation: '$animateMaskOff 0.3s'
  },
  switchOn:{
    transform: 'translateX(100%)',
    backgroundColor: theme.colors.white,
  },
  maskOn: {
    transform: 'translateX(160%)'
  },
  toggleButton: {
    position:'relative',
    width:'40px',
    height:'20px',
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