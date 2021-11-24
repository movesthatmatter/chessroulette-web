import React, { useState } from 'react';
import ReactTwitchEmbedVideo from 'react-twitch-embed-video';
import { AspectRatio } from 'src/components/AspectRatio';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { ResourceRecords } from 'dstnd-io';
import cx from 'classnames';
import { Text } from 'src/components/Text';
import { Avatar } from 'src/components/Avatar';
import { spacers } from 'src/theme/spacers';
import { effects } from 'src/theme';
import { useColorTheme } from 'src/theme/hooks/useColorTheme';
import { Badge } from 'src/components/Badge';

type Props = {
  featuredStreamer: ResourceRecords.Watch.LiveStreamerRecord;
  showChat?: boolean;
  muted?: boolean;
};

const aspectRatio = { width: 16, height: 9 };

export const LiveHero: React.FC<Props> = ({ featuredStreamer, muted = true, showChat = false }) => {
  const cls = useStyles();
  const [isReady, setIsReady] = useState(false);
  const { theme } = useColorTheme();

  return (
    <div className={cls.container}>
      <AspectRatio aspectRatio={aspectRatio}>
        {isReady || <div className={cx(cls.videoFallback)} />}
        <ReactTwitchEmbedVideo
          key={featuredStreamer.id}
          onReady={() => setIsReady(true)}
          channel={featuredStreamer.username}
          layout={showChat ? 'video-with-chat' : 'video'}
          height="100%"
          width="100%"
          targetClass={cx(cls.videoContainer, isReady || cls.hidden)}
          targetId={featuredStreamer.username}
          theme={theme.name === 'darkDefault' ? 'dark' : 'light'}
          muted={muted}
        />
      </AspectRatio>
      <div className={cls.bottomContainer}>
        <div className={cls.infoTop}>
          {/* <div> */}
          <Avatar imageUrl={featuredStreamer.profileImageUrl} size={64} />
          <div className={cls.streamInfoWrapper}>
            <div className={cls.streamerTitleWrapper}>
              <Text size="subtitle1">{featuredStreamer.displayName}</Text>
              <div style={{ width: spacers.small }} />
              <Badge
                color={theme.name === 'darkDefault' ? 'secondaryLight' : 'secondaryDark'}
                text={`${featuredStreamer.stream.viewerCount} viwers`}
              />
            </div>
            <Text size="subtitle2">{featuredStreamer.stream.title}</Text>
          </div>
        </div>
        <br />
        <Text size="body2">{featuredStreamer.description}</Text>
      </div>
    </div>
  );

  // return (
  //   <InfoCard
  //     top={
  //       <AspectRatio aspectRatio={{ width: 16, height: 9 }}>
  //         {isReady || (
  //           <div
  //             style={{
  //               width: '100%',
  //               height: '100%',
  //               background: 'purple',
  //             }}
  //           />
  //         )}
  //         <ReactTwitchEmbedVideo
  //           onReady={() => setIsReady(true)}
  //           channel={featuredStreamer.username}
  //           layout="video"
  //           height="100%"
  //           width="100%"
  //           targetClass={cx(cls.videoContainer, isReady || cls.hidden)}
  //           targetId={featuredStreamer.username}
  //           theme="light"
  //           muted
  //         />
  //       </AspectRatio>
  //     }
  //     bottomClassName={cls.bottomContainer}
  //     bottom={
  //       <>
  //         <div className={cls.infoTop}>
  //           <Avatar imageUrl={featuredStreamer.profileImageUrl} size={64} />
  //           <div className={cls.streamerTitle}>
  //             <Text size="subtitle1">{featuredStreamer.displayName}</Text>
  //             <br/>
  //             <Text size="subtitle1">{featuredStreamer.stream.title}</Text>
  //           </div>
  //         </div>
  //         <br/>
  //         <Text size="body2">{featuredStreamer.description}</Text>
  //       </>
  //     }
  //   />
  //   // </AspectRatio>
  // );
};

const useStyles = createUseStyles((theme) => ({
  container: {},
  videoContainer: {
    width: '100%',
    height: '100%',
    ...effects.hardBorderRadius,
    overflow: 'hidden',

    ...(theme.name === 'darkDefault' ? effects.softFloatingShadowDarkMode : effects.floatingShadow),
  },
  videoFallback: {
    width: '100%',
    height: '100%',
    background: theme.depthBackground.backgroundColor,
    ...effects.hardBorderRadius,
    overflow: 'hidden',
    ...(theme.name === 'darkDefault' ? effects.softFloatingShadowDarkMode : effects.floatingShadow),
  },
  bottomContainer: {
    ...makeImportant({
      paddingTop: spacers.large,
    }),
  },
  infoTop: {
    display: 'flex',
  },

  streamInfoWrapper: {
    paddingLeft: spacers.default,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },

  streamerTitleWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  streamerTitle: {
    paddingLeft: spacers.default,
  },

  hidden: {
    visibility: 'hidden',
  },
}));
