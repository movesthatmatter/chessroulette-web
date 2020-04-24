import React from 'react';
import './LandingPage.css';
import logo from '../../assets/dstnd-logo.svg';
import playSVG from '../../assets/play-circle.svg';
import videoSVG from '../../assets/video.svg';
import chatSVG from '../../assets/message-circle.svg';
import CircularButton from './CircularButton/CircularButton';


export default function LandingPage (){
    return(
        <div className="Background">
            <div className="contentContainer">
                <div className="leftMargin"/>
                <div className="LeftSideContainer">
                    <img src={logo} alt="logo" className="logo"/>
                    <div className="HeaderContainer">
                        <p className="HeaderText">P2P Gaming with Video Chat</p>
                    </div>
                    <div className="textContainer">
                        <p className="text">No account needed. Free P2P Game hosting and video chat.
                                            Just share the generated code with a friend and start playing.</p>
                        <div style={{marginBottom : '30px'}}/>
                        <p className="text">Play NOW!</p>
                    </div>
                </div>
                <div className="RightSideContainer">
                    <div className="chessboardContainer">
                        <div className="chessboard">
                            <div className="playButtonContainer">
                                <CircularButton imageURL={playSVG} color="#D64349"/>
                            </div>
                            <div className="videoButtonContainer">
                                <CircularButton imageURL={videoSVG} color="#983A7E"/>
                            </div>
                            <div className="chatButtonContainer">
                                <CircularButton imageURL={chatSVG} color="#1C2C84"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="rightMargin"/>
            </div>
        </div>
    )
}

