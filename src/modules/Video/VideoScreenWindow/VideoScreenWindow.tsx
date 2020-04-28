import React from 'react';
import './VideoScreenWindow.css';

type Props = {
   load : boolean,
   background : 'light' | 'dark',
   children? : React.ReactNode,
}
export const VideoScreenWindow = ({load, background, children} : Props) => {
    let classes = ['VideoScreen'];
    if (load) {
        classes.push('loaded');
    } else {
        classes.push('default');
    }
    classes.push(background);
    return (
        <div className={classes.join(' ')}>{children}</div>
    )
}