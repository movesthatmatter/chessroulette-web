import React from 'react';
import { useParams } from 'react-router-dom';
import { createUseStyles } from 'src/lib/jss';
import { LivePage } from './LivePage';

type Props = {};

export const LiveRoute: React.FC<Props> = (props) => {
  const params = useParams<{ streamer: string }>();

  console.log('params', params);

  return (
    <LivePage heroStreamer={params.streamer}/>
  );
};

const useStyles = createUseStyles({
  container: {},
});