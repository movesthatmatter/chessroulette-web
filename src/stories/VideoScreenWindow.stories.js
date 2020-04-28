import React from 'react';
import {VideoScreenWindow} from '../modules/Video/VideoScreenWindow/VideoScreenWindow';

export default {
    component: VideoScreenWindow,
    title : 'UI Components/Video Module'
}

export const VideoScreen = () => {
 return (
     <VideoScreenWindow load
                        background = 'light' >
        <div style={{height : '100%' ,width : '100%', backgroundColor: 'orange'}}>
        <label>Loaded Content</label>
        </div>
    </VideoScreenWindow>
 );
};