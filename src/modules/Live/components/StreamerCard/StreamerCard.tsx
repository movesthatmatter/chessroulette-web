import { ResourceRecords } from 'dstnd-io';
import React from 'react';
import { AspectRatio } from 'src/components/AspectRatio';
import { createUseStyles } from 'src/lib/jss';

type Props = {
  streamer: ResourceRecords.Watch.StreamerRecord;
};

export const StreamerCard: React.FC<Props> = (props) => {
  const cls = useStyles();

  console.log('streamer', props.streamer);

  return (
    <img
      src={props.streamer.profileImageUrl}
      // style={{
      //   width: props.width,
      //   height: props.height,
      // }}
    />
  );
};

const useStyles = createUseStyles({
  container: {},
});
