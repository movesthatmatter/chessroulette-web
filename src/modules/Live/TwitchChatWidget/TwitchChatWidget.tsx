import React from 'react';
import config from 'src/config';
import { createUseStyles } from 'src/lib/jss';
import { CustomTheme } from 'src/theme';

type Props = {
  channel: string;
};

export const TwitchChatWidget: React.FC<Props> = ({ channel}) => {
  const cls = useStyles();
  const parent = config.DEBUG ? 'localhost' : 'www.chessroulette.live';
  return (
    <div className={cls.container}>
      <iframe
        src={`https://www.twitch.tv/embed/${channel}/chat?parent=${parent}`}
        height="100%"
        width="100%"
        className={cls.chatContainer}
      ></iframe>
    </div>
  );
};

const useStyles = createUseStyles<CustomTheme>(theme => ({
  container: {
    height:'100%',
    width:'100%'
  },
  chatContainer: {
    border: 0,
    borderRadius: '16px',
    overflow: 'hidden',
    ...theme.floatingShadow,
  },
}));
