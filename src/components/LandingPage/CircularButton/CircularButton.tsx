import React from 'react';
import './CircularButton.css';


export default function CircularButton(props : {imageURL : string , color : string}) {
    return <div className="button"
                style={{background : props.color}}>
        <img src ={props.imageURL} alt="buttonLabel"/>
    </div>
}