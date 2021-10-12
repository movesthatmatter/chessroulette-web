import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { Peer } from 'src/providers/PeerProvider';
import { CustomTheme, fonts } from 'src/theme';
import { Text } from '../../../../components/Text';
import { getUserDisplayName } from 'src/modules/User';
import { PeerAvatar } from '../PeerAvatar';
import { spacers } from 'src/theme/spacers';
import { getPeerStatusInfo } from '../util';
import { useSelector } from 'react-redux';
import { selectPeerProviderState } from '../../redux/selectors';

type Props = {
  darkBG?: boolean;
  reversed?: boolean;
  showPeerStatus?: boolean;
} & (
  | {
      peer: Peer;
      peerUserInfo?: undefined;
    }
  | {
      peer?: undefined;
      peerUserInfo: Peer['user'];
    }
);

export const PeerInfo: React.FC<Props> = ({
  darkBG,
  reversed,
  showPeerStatus = true,
  ...props
}) => {
  const cls = useStyles();
  const room = useSelector(selectPeerProviderState).room;
  const peer = props.peer || room?.peersIncludingMe[props.peerUserInfo.id];

  if (!peer) {
    return null;
  }

  return (
    <div
      className={cx(
        cls.container,
        darkBG && cls.containerDarkMode,
        reversed && cls.containerReversed
      )}
    >
      <PeerAvatar reversed={reversed} peer={peer} />
      <div className={cls.spacer} />
      <div className={cx(cls.textWrapper, showPeerStatus || cls.textWrapperCentered )}>
        <Text className={cls.userNameText}>
          {getUserDisplayName(peer.user)}
        </Text>
        {showPeerStatus && (
          <Text size="small1">
            {getPeerStatusInfo(peer)}
          </Text>
        )}
      </div>
    </div>
  );
};

const useStyles = createUseStyles<CustomTheme>(theme => ({
  container: {
    display: 'flex',
  },
  containerReversed: {
    flexDirection: 'row-reverse',
  },
  containerDarkMode: {
    color: '#fff',
  },
  userNameText: {
    ...fonts.small2,
  },
  spacer: {
    paddingLeft: spacers.small,
  },
  textWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'column',
  },
  textWrapperCentered: {
    justifyContent: 'center',
  },
}));
