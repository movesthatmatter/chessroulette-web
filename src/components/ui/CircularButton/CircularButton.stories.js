import React from 'react';
import CircularButton from './CircularButton';
import { action } from '@storybook/addon-actions';

export default {
    component : CircularButton,
    title : "UI Components/Landing Page/Circular Button",
}

export const videoButton = () => <CircularButton 
                                        color = '#E66162'
                                        imageURL = 'video'
                                        onClickFunction = {action("button clicked!")}
                                        />

export const chatButton = () => <CircularButton
                                        color = '#08D183'
                                        imageURL = 'message-circle'
                                        onClickFunction = {action('button clicked')}
                                        />

export const playButton = () => <CircularButton
                                        color = '#54C4F2'
                                        imageURL = 'play-circle'
                                        onClickFunction = {action('button clicked')}
                                        />
