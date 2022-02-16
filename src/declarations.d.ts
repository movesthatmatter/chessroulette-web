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

declare module 'react-chessground-wargame' {
  import * as React from 'react'
  import {MoveType} from 'dstnd-io'
  import {Key, Piece} from 'chessground-wargame/types'
  import {Chessground as NativeChessground} from 'chessground-wargame'

  type Config = NonNullable<Parameters<typeof NativeChessground>[1]>

  export type ChessgroundApi = ReturnType<typeof NativeChessground>

  export interface ChessgroundProps extends Config {
    width?: number | string
    height?: number | string
    style?: React.CSSProperties
    className?: string
    playable?:boolean;
    onChange?: () => void
    onMove?: (
      orig: Key,
      dest: Key,
      type: MoveType,
      capturedPiece?: Piece,
    ) => void
    onDrop?: () => void
    onDrag?: (orig: Key) => void
    onDropNewPiece?: (piece: Piece, key: Key) => void
    onSelect?: (key: Key) => void
  }

  export default class Chessground extends React.Component<ChessgroundProps> {}
}
