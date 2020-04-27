import Chessboard from 'chessboardjsx';
import React from 'react';

type Props = Chessboard['props'];

export const Board : React.FC<Props> = (props : Props = { }) => {
    return (
        <Chessboard {...props}/>
    )
}