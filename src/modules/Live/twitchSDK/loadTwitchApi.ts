import root, { Promise } from 'window-or-global';
import { IPlayerInterface, IChannelEmbedParameters, ITwitchEmbed } from './types';

export const EMBED_URL = 'https://embed.twitch.tv/embed/v1.js';

export type TwitchSDK = {
  Player: new (target: string, opts: IChannelEmbedParameters) => IPlayerInterface & ITwitchEmbed;
};

export const loadTwitchApi = (callback?: (Twitch: TwitchSDK) => unknown): Promise<TwitchSDK> => {
  const Twitch = (root as any).Twitch;

  if (Twitch) {
    if (callback) {
      callback(Twitch);
    }
    return Promise.resolve(Twitch);
  }

  return new Promise((resolve) => {
    const script = document.createElement('script');

    script.setAttribute('src', EMBED_URL);

    const onLoadHandler = () => {
      const Twitch = (root as any).Twitch;

      if (Twitch) {
        if (callback) {
          callback(Twitch);
        }

        resolve(Twitch);
      }

      script.removeEventListener('load', onLoadHandler);
    };

    // Wait for DOM to finishing loading before we try loading embed
    script.addEventListener('load', onLoadHandler);

    document.body.append(script);
  });
};
