import React from "react";
import "./LandingPage.css";
import logo from "../../../assets/logo_black.svg";
import SplashScreenBoardWithButtons from '../../../components/ui/SplashScreenBoardWithButtons/SplashScreenBoardWithButtons';
import {NavLink} from 'react-router-dom';

export default function LandingPage() {
    return (
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
  );
}
