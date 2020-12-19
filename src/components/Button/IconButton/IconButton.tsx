import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Icon as GIcon } from 'grommet-icons';
import { borderRadius, colors } from 'src/theme';
import cx from 'classnames';
import { ButtonType } from '../type';
import { buttonStyles } from '../styles/styles';
import { AsyncResult } from 'dstnd-io';
import Loader from 'react-loaders';
import 'loaders.css';

type Props = {
  icon: GIcon;
  onSubmit: (() => void) | (() => Promise<any>) | (() => AsyncResult<any, any>);
  type?: ButtonType;
  clear?: boolean;
  disabled?: boolean;
  withLoader?: boolean;
  className?: string;
};

export const IconButton: React.FC<Props> = ({
  type = 'primary',
  clear = false,
  withLoader = false,
  ...props
}) => {
  const cls = useStyles();
  const Icon = props.icon;
  const [isLoading, setIsLoading] = useState(false);

  return (
    <button
      disabled={props.disabled}
      type="submit"
      className={cx(
        cls.button,
        cls.iconButton,
        clear && cls.clear,
        props.disabled || cls[type],
        isLoading && cls.hasLoader,
        props.className
      )}
      onClick={() => {
        if (isLoading) {
          return;
        }

        const result = props.onSubmit();

        if (!withLoader) {
          return;
        }

        if (AsyncResult.isAsyncResult(result)) {
          setIsLoading(true);

          result.map(() => setIsLoading(false)).mapErr(() => setIsLoading(false));
        } else {
          setIsLoading(true);

          Promise.resolve(result).finally(() => {
            setIsLoading(false);
          });
        }
      }}
    >
      <div className={cls.iconWrapper}>
        {isLoading ? (
          <Loader type="ball-clip-rotate" active innerClassName={cls.loader} />
        ) : (
          <Icon className={cls.icon} />
        )}
      </div>
    </button>
  );
};

const useStyles = createUseStyles({
  ...buttonStyles,
  clear: {
    ...buttonStyles.clear,
  },
  iconWrapper: {
    width: '32px',
    height: '32px',

    ...borderRadius,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fill: `${colors.white} !important`,
    stroke: `${colors.white} !important`,
    width: '16px !important',
    height: '16px !important',
  },
  loadingWrapper: {
    position: 'absolute',
    top: '3px',
    left: 0,
    right: 0,
    bottom: '3px',
    display: 'flex',
    flexDirection: 'row',
  },
  loader: {
    transform: 'scale(.6)',
    display: 'flex',
  },
});
