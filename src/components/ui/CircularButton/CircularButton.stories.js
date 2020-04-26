import React from 'react';
import {storiesOf} from '@storybook/react';
import CircularButton from './CircularButton';
import { action } from '@storybook/addon-actions';


storiesOf("CircularButton", module)
.add("default state", 
    () => <CircularButton 
            color = 'orange' 
            imageURL = "video"
            onClickFunction = {action("button clicked")}
            /> )