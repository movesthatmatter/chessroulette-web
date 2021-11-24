import React, { useMemo } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { noop, objectKeys } from 'src/lib/util';
import { encodeURI, String, window } from 'window-or-global';
import cx from 'classnames';

type Props = {
  channel: string;
  height: string;
  width: string;
  targetId: string;
  theme?: 'dark' | 'light';
  targetClass?: string;
  isInteractive?: boolean;
  parent?: string;

  onReady?: () => void;
};

const toUrlParams = <T extends Record<string, string | number | undefined>>(o: T) =>
  objectKeys(o)
    .reduce((prev, key) => {
      const val = o[key];
      const valStr = val !== undefined ? `${key}=${encodeURI(String(val))}` : String(key);

      return [...prev, valStr];
    }, [] as string[])
    .join('&');

export const TwitchChatEmbed: React.FC<Props> = ({
  channel,
  height,
  width,
  targetId,
  targetClass,
  theme,
  parent = window.location.hostname,
  onReady = noop,
}) => {
  const cls = useStyles();
  const params = useMemo(
    () =>
      toUrlParams({
        parent,
        width,
        height,
        targetId,
        ...(theme === 'dark' && { darkpopout: undefined }),
      }),
    [channel, parent, width, height, targetId, targetClass, theme]
  );

  return (
    <iframe
      onLoad={onReady}
      id="twitch-chat-embed"
      src={`https://www.twitch.tv/embed/${channel}/chat?${params}`}
      scrolling="no"
      frameBorder={0}
      allow="autoplay; fullscreen"
      sandbox="allow-modals allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      height={height}
      width={width}
      className={cx(cls.container, targetClass)}
    />
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    background: theme.depthBackground.backgroundColor,
  },
}));
