import React, { useState } from 'react';
import { createUseStyles, makeImportant } from 'src/lib/jss';
import { Icon as GIcon } from 'grommet-icons';
import { borderRadius, CustomTheme, onlyMobile, softBorderRadius, softOutline } from 'src/theme';
import cx from 'classnames';
import { ButtonType } from '../type';
import { buttonStyles } from '../styles/styles';
import { AsyncResult } from 'ts-async-results';
import Loader from 'react-loaders';
import 'loaders.css';
import { spacers } from 'src/theme/spacers';
import { Text } from 'src/components/Text';

type Props = {
  icon: GIcon;
  onSubmit: (() => void) | (() => Promise<any>) | (() => AsyncResult<any, any>);
  type?: ButtonType;
  clear?: boolean;
  disabled?: boolean;
  withLoader?: boolean;
  className?: string;
  title?: string;
  tooltip?: string;
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
      title={props.title}
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
      {props.tooltip && (
        <div className={cls.tooltipContainer}>
          <div className={cls.tooltipText}>
            <Text size="small1">{props.tooltip}</Text>
          </div>
        </div>
      )}
    </button>
  );
};

const useStyles = createUseStyles<CustomTheme>(theme => ({
  ...buttonStyles,
  button: {
    ...buttonStyles(theme).button,
    ...onlyMobile({
      ...makeImportant({
        height: '28px',
        width: '28px',
        lineHeight: '28px',
        marginBottom: '13px',
      }),
    }),

    position: 'relative',
  },
  clear: {
    ...buttonStyles(theme).clear,
  },
  iconWrapper: {
    width: '32px',
    height: '32px',

    ...onlyMobile({
      ...makeImportant({
        width: '28px',
        height: '28px',
      }),
    }),

    ...borderRadius,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fill: `${theme.colors.white} !important`,
    stroke: `${theme.colors.white} !important`,
    color: `${theme.colors.white} !important`,
    width: '16px !important',
    height: '16px !important',

    ...onlyMobile({
      ...makeImportant({
        width: '14px',
        height: '14px',
      }),
    }),
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
  tooltipContainer: {
    position: 'absolute',
    transition: 'all 500ms linear',
    bottom: '-120%',
    transform: 'translateX(-25%)',
    marginTop: spacers.large,
    zIndex: 999,
  },
  tooltipText: {
    marginLeft: spacers.small,
    padding: spacers.small,
    lineHeight: 0,
    background: theme.colors.white,
    boxShadow: '0 6px 13px rgba(16, 30, 115, 0.08)',
    ...softOutline,
    ...softBorderRadius,
  },
}));
