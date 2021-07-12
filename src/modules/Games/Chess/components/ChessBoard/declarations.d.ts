declare module 'react-chessground' {
  import * as React from 'react';
  import { Key, Piece } from 'chessground/types';
  import { Chessground as NativeChessground } from 'chessground';

  type Config = NonNullable<Parameters<typeof NativeChessground>[1]>;

  export type ChessgroundApi = ReturnType<typeof NativeChessground>;

  export interface ChessgroundProps extends Config {
    width?: number | string;
    height?: number | string;
    style?: CSSProperties;
    className?: string;

    onChange?: () => void;
    onMove?: (orig: Key, dest: Key, capturedPiece?: Piece) => void;
    onDropNewPiece?: (piece: Piece, key: Key) => void;
    onSelect?: (key: Key) => void;
  }

  export default class Chessground extends React.Component<ChessgroundProps> {}
}
