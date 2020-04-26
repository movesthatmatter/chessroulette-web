import React, { useState } from 'react';
import './CircularButton.css';

export default function CircularButton (props : {
    imageURL : string , 
    color : string,
    onClickFunction : () => void;
    }) {
    const [mouseOver, setMouseOver] = useState<boolean | undefined>(false);
    let btnStyle : Array<string> = ["button"];
    if (mouseOver) {
        btnStyle.push("mouseOver");
    }
    return <div className={btnStyle.join(' ')}
                style={{background : props.color}}
                onMouseOver={()=> {
                    setMouseOver(true);
                }}
                onMouseOut={()=> {
                    setMouseOver(false);
                }}
                onClick={props.onClickFunction}>
        <img src ={require(`../../../assets/${props.imageURL}.svg`)} alt="buttonLabel"/>
    </div>
}