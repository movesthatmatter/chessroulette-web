/* eslint-disable import/no-duplicates */
/* eslint-disable max-classes-per-file */
/**
 * A list of module decleration for packages that don't provide one on npm.
 * This needs to be done so the compiler doesn't complain!
 */

declare module '*.wav';
declare module '*.ogg';
declare module '*.mp3';
declare module '*.m4a';
declare module '*.ac3';

declare module 'react-popout';

declare module 'react-snapshot';

declare module 'object-equals';

declare module 'can-ndjson-stream' {
  export default function ndjsonStream(data : unknown): {
    getReader : () => {
      read : () => Promise<{
        done : boolean;
        value: any;
      }>;
    };
    cancel : () => void;
  }
}

declare module 'use-debounced-effect' {
  import { DependencyList, EffectCallback } from 'react';

  export default function useDebouncedEffect(effect: EffectCallback, delay: number, deps: DependencyList): void;
}

declare module 'react-twitch-embed-video';
