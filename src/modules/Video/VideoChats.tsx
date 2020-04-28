import React, { useState } from 'react';
import './VideoChats.css';
import {VideoScreenWindow} from './VideoScreenWindow/VideoScreenWindow';

type userType = {
    loaded : boolean,
}
type usersType = {
   [key : string] : userType,
}
const users : usersType = {
    user1 : {
        loaded : false,
    },
    user2 : {
        loaded : false,
    },
    user3 : {
        loaded : false,
    },
    user4 : {
        loaded : false,
    }
}

enum BackgroundType {
    dark = 'dark',
    light = 'light'
}

export const VideoChats = () => {
    const [usersStatus , setUsersStatus]  = useState<usersType>({...users});    
    return (
        <>
        <div className="Container">
             <div className="VideoChats">
                <div className="Left">
                        <VideoScreenWindow load={usersStatus.user1.loaded} background={BackgroundType.dark}/>  
                        <VideoScreenWindow load={usersStatus.user2.loaded} background={BackgroundType.light}/>  
                </div>
                <div className="Right">
                        <VideoScreenWindow load={usersStatus.user3.loaded} background={BackgroundType.light}/>  
                        <VideoScreenWindow load={usersStatus.user4.loaded} background={BackgroundType.dark}/>                     
                </div>
            </div>
        </div>    
      <div className="Controls">
        <Selector 
            inputChange ={(value : string) => {
                Object.keys(users).reduce( (acc, user) => {
                    if (Object.keys(users).indexOf(user) <= Number(value) -1 ){
                        users[user].loaded = true;
                    } else {
                        users[user].loaded = false; 
                    }
                    setUsersStatus({...users})
                    return acc;
                },{})
            }}/>
        </div> 
        </> 
    );
};

type SelectorProps = {
    inputChange : (value : string) => void 
}
const Selector = (props : SelectorProps) => {
    return (
        <div>
            <label style={{marginRight : '20px'}}>Users Loaded</label>  
            <input 
                    type= 'number'
                    defaultValue= '0'
                    min='0'
                    max='4' 
                    onChange={(event) => props.inputChange(event.target.value)}
                    />
        </div>
    )
}