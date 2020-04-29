import React from 'react';
import { createUseStyles } from 'src/lib/jss';

type Props = {};

export const Video: React.FC<Props> = () => {
  const classes = useStyle();

  return (
    <div className={classes.container}>
      {/* <video
      autoPlay
      muted={this.props.isMuted}
      playsInline
      style={{ width: '100%' }}
    /> */}
    </div>
  );
};

const useStyle = createUseStyles({
  container: {
    backgroundColor: 'red',
    width: '200px',
    height: '200px',
  },
});
