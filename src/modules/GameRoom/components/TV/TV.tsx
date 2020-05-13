import React from 'react';
import cx from 'classnames';
import { FaceTime, FaceTimeProps } from 'src/components/FaceTimeArea';
import { createUseStyles } from 'src/lib/jss';
import { AspectRatio } from 'src/components/AspectRatio';

type Props = Omit<FaceTimeProps, 'classNames' | 'style'> & {
  width: number;
  classNames?: string;
  fallbackComponent?: React.ReactNode;
}

export const TV: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <AspectRatio
      width={props.width}
      aspectRatio={{ width: 4, height: 3 }}
      className={cx(cls.container, props.classNames)}
    >
      {props.streamConfig.on
        ? (
          <FaceTime
            containerClassName={cls.faceTime}
            streamConfig={props.streamConfig}
            muted={props.muted}
          />
        )
        : (props.fallbackComponent)}
    </AspectRatio>
  );
};

const useStyles = createUseStyles({
  container: {},
  faceTime: {
    background: '#efefef',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  faceTimeVideo: {
  },
});
