import { Layer, LayerProps } from 'grommet';
import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { AwesomeLoader } from '../AwesomeLoader';
import { Text } from '../Text';
import cx from 'classnames';
import { colors, floatingShadow, fonts, onlyMobile, softBorderRadius } from 'src/theme';
import { Dialog } from '../Dialog/Dialog';

type Props = {
  target?: LayerProps['target'];
  className?: string;
  size?: number;
};
const sayings = [
  'Loading...',
  'Your opponent is just getting ready',
  `Let's hope your friend is not scared of a challenge`,
  'Establishing connection...',
  `Patience is a virtue.. I guess`,
  `Get ready, your friend is on the way.`,
  `Still time to polish your chess`,
];

export const PlayerPendingOverlay = ({ target, className, size }: Props) => {
  const cls = useStyles();
  const date = new Date().getTime();
  return (
      <Layer
        key={date}
        plain
        modal
        target={target}
        animation={false}
        position="center"
        className={cls.container}
      >
        <div className={cx(cls.contentWrapper, className)}>
          <Text size='body1' className={cls.contentText}>Waiting for your friend to join.</Text>
          <br/>
          <AwesomeLoader sayings={sayings} className={cls.loader} size={size} />
          
        </div>
      </Layer>
  );
};

const useStyles = createUseStyles({
  container: {
    width: '300px',
    textAlign: 'center',
    boxShadow : '0 16px 50px rgb(4 9 37 / 75%)',
    borderRadius: '8px !important',
    minWidth: '250px !important',
    maxWidth: '360px !important',
    ...onlyMobile({
      width: '84% !important',
      maxWidth: 'none !important',
    }),
    position: 'relative',
    padding: '24px !important',
    backgroundColor: colors.white,
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  contentText: {
    
  },
  loader: {},
});
