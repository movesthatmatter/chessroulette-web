import React from 'react';
import {createUseStyles, CSSProperties} from 'src/lib/jss';
import {Chat} from 'grommet-icons';
import {Box ,Text} from 'grommet';
import { colors } from 'src/theme';

type Props = {
    onClick : () => void;
    color : CSSProperties['color'];
    style? : CSSProperties;
    newMessages : number
}
export const ChatIconWithBadge = ({color, onClick, style, newMessages} : Props) => {
    const cls = useStyles();
    return (
         <div className={cls.iconContainer}>
            <Chat color={color} onClick={onClick} style={style}/>
            {newMessages > 0 && (
               <div className={cls.badgeContainer}>
                   {newMessages.toString()}
                </div>
            )}
        </div>
    )
}

const useStyles = createUseStyles({
    iconContainer:{
        display:'flex',
    },
    badgeContainer:{
        position: 'absolute',
        left:'24px',
        bottom:'47px',
        backgroundColor: colors.primary,
        color:'white',
        display:'flex',
        justifyContent:'center',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
    },
})