import React from 'react';
import { Hoverable } from 'src/components/Hoverable';
import { createUseStyles } from 'src/lib/jss';
import { ChessBoard, ChessBoardProps } from '../../Chess/components/ChessBoard';

type Props = ChessBoardProps & {
  hoverableClassName?: string;
} & (
    | {
        hoveredText: string;
        onClick: () => void;
        hoveredComponent?: undefined;
      }
    | {
        hoveredComponent: React.ReactNode;
        hoveredText?: undefined;
      }
    | {
        hoveredText?: undefined;
        hoveredComponent?: undefined;
      }
  );

export const HoverableChessBoard: React.FC<Props> = ({ hoverableClassName, ...props }) => {
  return (
    <Hoverable
      containerClassName={hoverableClassName}
      {...(props.hoveredText
        ? {
            overlayButtonProps: {
              label: props.hoveredText,
              onClick: props.onClick,
            },
          }
        : {
            overlayContent: props.hoveredComponent,
          })}
    >
      <ChessBoard {...props} />
    </Hoverable>
  );
};
