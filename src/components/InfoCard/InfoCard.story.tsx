/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { AspectRatio } from '../AspectRatio';
import { InfoCard } from './InfoCard';

export default {
  component: InfoCard,
  title: 'components/InfoCard',
};

export const defaultStory = () => (
  <div
    style={{
      width: '320px',
    }}
  >
    <InfoCard
      top={
        <AspectRatio
          aspectRatio={{ width: 16, height: 9 }}
          style={{
            // backgroundImage: 'url(https://partner.chessroulette.live/images/hero_b.png)',
            // backgroundSize: 'cover',
            // ...effects.hardBorderRadius,
            overflow: 'hidden',
            // marginBottom: spacers.large,
          }}
        >
          <img
            src="https://partner.chessroulette.live/images/hero_b.png"
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </AspectRatio>
      }
      bottom={'info'}
    />
  </div>
);
