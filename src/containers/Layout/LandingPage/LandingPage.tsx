import React from "react";
import "./LandingPage.css";
import logo from "../../../assets/logo_black.svg";
import SplashScreenBoardWithButtons from '../../../components/ui/SplashScreenBoardWithButtons/SplashScreenBoardWithButtons';
import {Switch, Route, NavLink, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import {GamePage} from '../Game/GamePage';


export default function LandingPage() {
    let location = useLocation();
    return (
        <div className="Background">
        <Switch location={location}>
        <TransitionGroup component={null}>
            <Route exact path="/game" key={location.key}>
                {({match}) => (
                        <CSSTransition
                            in={match !== null}
                            key={location.key}
                            classNames="gameComponent"
                            timeout={600}
                            unmountOnExit>
                            <div className= "gameComponent">
                                <GamePage/>
                            </div>
                        </CSSTransition>
                )}
            </Route>
            <Route exact strict path="/" key={location.key}>
                {({match}) => (
                     <CSSTransition 
                     in={match !== null}
                     key={location.key}
                     classNames="contentContainer" 
                     timeout={600}
                     unmountOnExit >
                    <div className="contentContainer">
                    <div className="leftMargin" />
                            <div className="LeftSideContainer">
                                <img src={logo as string} alt="logo" className="logo" />
                                <div className="HeaderContainer">
                                <p className="HeaderText">P2P Chess Games with Video Chat</p>
                                </div>
                                <div className="textContainer">
                                <p className="text">
                                    No account needed. Free P2P Chess Game hosting and video chat.
                                    Just share the generated code with a friend and start playing.
                                </p>
                                <div style={{ marginBottom: "30px" }} />
                                <div className="link">
                                    <div className="linkContainer">
                                    <NavLink to="/game">Play NOW!</NavLink>
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div className="RightSideContainer">
                                <SplashScreenBoardWithButtons/>
                            </div>
                        <div className="rightMargin" />
                    </div>
                </CSSTransition>
                )}
                </Route>
        </TransitionGroup>
        </Switch>
        </div>
  );
}
