import React from 'react';
import logo from 'src/assets/logo_black.svg';
import { createUseStyles } from 'src/lib/jss';
import { SplashScreenBoardWithButtons } from './components/SplashScreenBoardWithButtons';
import { JoinCreateButtons } from './components/JoinCreateButtons/JoinCreateButtons';

type Props = {};

export const LandingPage: React.FC<Props> = () => {
  const cls = useStyles();
  return (
    <div className={cls.container}>
      <div className={cls.leftMargin} />
      <div className={cls.leftSideContainer}>
        <img src={logo} alt="logo" className={cls.logo} />
        <div>
          <p className={cls.headerText}>
            P2P Chess Games with Video Chat
          </p>
        </div>
        <div style={{ marginTop: '5px', marginBottom: '10px' }} className={cls.text}>
          No account needed. Free P2P Chess Game hosting and video chat. Just
          share the generated code with a friend and start playing.
        </div>
        <div className={cls.buttonsContainer}>
          <JoinCreateButtons />
        </div>
      </div>
      <SplashScreenBoardWithButtons />
      <div className={cls.rightMargin} />
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  background: {
    color: '#262626',
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
  },
  headerText: {
    fontFamily: 'Roboto Slab',
    fontWeight: 'bold',
    fontSize: '48px',
    lineHeight: '63px',
    margin: '0 auto',
    color: '#262626',
  },
  buttonsContainer: {
    marginTop: '20px',
    marginLeft: '40px',
  },
  logo: {
    marginBottom: '40px',
  },
  text: {
    fontFamily: 'Open Sans',
  },
  link: {
    margin: '0px',
    maxWidth: '100px',
    borderRadius: '15px',
    backgroundColor: '#e9685a',
    textAlign: 'center',
    color: 'white',
    textDecoration: 'none',

    '&:hover': {
      transform: 'scale(1.05)',
      textDecoration: 'none',
      cursor: 'pointer',
      backgroundColor: '#e9685a',
    },
  },
  linkContent: {
    padding: '10px',
  },
  leftMargin: {
    width: '100%',
  },
  rightMargin: {
    width: '100%',
  },
  leftSideContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    minWidth: '500px',
    marginRight: '70px',
  },
});
