import React, { useEffect, useMemo, useState } from 'react';
import ReactTwitchEmbedVideo from 'react-twitch-embed-video';
import { AspectRatio } from 'src/components/AspectRatio';
import { createUseStyles } from 'src/lib/jss';
import { CollaboratorAsStreamer, StreamerCollection } from '../types';
import { getCollaboratorsByPlatform } from '../resources';
import { CollaboratorRecord } from 'dstnd-io';
import { toStreamerCollectionByRank } from 'src/modules/Live/twitchSDK/useGetStreamerCollectionWithLiveStatus';
import { effects } from 'src/theme';

type Props = {
  featured: CollaboratorAsStreamer;
};

const toCollaboratorStreamer = (
  c: CollaboratorRecord,
  isLive: boolean
): CollaboratorAsStreamer => ({
  ...c,
  isLive,
});

export const LiveHero: React.FC<Props> = ({ featured }) => {
  const cls = useStyles();

  return (
    <AspectRatio
      aspectRatio={{ width: 16, height: 9 }}
      style={{
        flex: 1,
      }}
    >
      {/* <div
        style={{
          width: '100%',
          height: '100%',
          background: 'purple',
          // flex: 1,
        }}
      /> */}
      <ReactTwitchEmbedVideo
        channel={featured.profileUrl}
        layout="video"
        height="100%"
        width="100%"
        targetClass={cls.videoContainer}
        targetId={featured.profileUrl}
      />
    </AspectRatio>
  );
};

const useStyles = createUseStyles({
  container: {},
  videoContainer: {
    border: 0,
    backgroundColor: '#ededed',
    // borderRadius: '16px',
    ...effects.softBorderRadius,
    overflow: 'hidden',

    width: '100%',
    height: '100%',
  },
});
