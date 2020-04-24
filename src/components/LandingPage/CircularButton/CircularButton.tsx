import React, { useState } from 'react';
import './CircularButton.css';


export default function CircularButton (props : {
    imageURL : string , 
    color : string, 
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
                }}>
        <img src ={props.imageURL} alt="buttonLabel"/>
    </div>
}