import { StreamerRecord } from 'dstnd-io/dist/resourceCollections/watch/records';
import React from 'react';
import { AnchorLink } from 'src/components/AnchorLink';
import { Avatar } from 'src/components/Avatar';
import { createUseStyles } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';

type Props = {
  streamers: StreamerRecord[];
};

export const StreamersCollection: React.FC<Props> = ({ streamers }) => {
  const cls = useStyles();

  return (
    <div className={cls.streamerCollectionList}>
      {streamers.map((collaborator) => {
        // const s = streamers.itemsById[streamerId];

        return (
          <div
            key={collaborator.id}
            style={{
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <div
                style={{
                  paddingRight: spacers.default,
                }}
              >
                <AnchorLink href={`https://twitch.tv/${collaborator.username}`} target="_blank">
                  <Avatar imageUrl={collaborator.profileImageUrl || ''} size={60} />
                </AnchorLink>
              </div>
              {/* <div>
                          <AnchorLink
                            href={`https://twitch.tv/${collaborator.username}`}
                            target="_blank"
                          >
                            <Text asLink size="subtitle1">
                              {collaborator.displayName}
                            </Text>
                          </AnchorLink>
                          <Text
                            size="body2"
                            asParagraph
                            style={{
                              marginTop: '.2em',
                              // color: theme.text.baseColor,
                            }}
                          >
                            {collaborator.description.length > 75
                              ? `${collaborator.description?.slice(0, 75)}...`
                              : collaborator.description}
                            <br />
                            <AnchorLink
                              href={`https://twitch.tv/${collaborator.username}/about`}
                              target="_blank"
                            >
                              Learn More
                            </AnchorLink>
                          </Text>
                        </div> */}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const useStyles = createUseStyles({
  streamerCollectionList: {
    display: 'flex',
    flexDirection: 'row',
  },
});
