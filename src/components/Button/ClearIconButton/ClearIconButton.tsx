import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { softBorderRadius, softOutline } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import cx from 'classnames';
import { noop } from 'src/lib/util';

type Props = {
  icon: FontAwesomeIconProps['icon'];
  iconProps?: Omit<FontAwesomeIconProps, 'icon'>;
  title?: string;
  tooltip?: string;
  tooltipOnHover?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

export const ClearIconButton: React.FC<Props> = ({
  onClick = noop,
  tooltipOnHover = true,
  ...props
}) => {
  const cls = useStyles();

  return (
    <div className={cls.container} title={props.title}>
      <FontAwesomeIcon
        icon={props.icon}
        size="xs"
        className={cx(cls.icon, props.disabled && cls.iconDisabled, props.className)}
        onClick={() => {
          if (props.disabled) {
            return;
          }

          onClick();
        }}
        {...props.iconProps}
      />
      {props.tooltip && (
        <div className={cx(cls.tooltipContainer, tooltipOnHover && cls.tooltipOnHover)}>
          <div className={cls.tooltipText}>
            <Text size="small1">{props.tooltip}</Text>
          </div>
        </div>
      )}
    </div>
  );
};

const useStyles = createUseStyles(theme => ({
  container: {
    position: 'relative',
    height: spacers.default,
    display: 'flex',
  },
  icon: {
    cursor: 'pointer',

    '&:hover': {
      opacity: 0.5,
    },
  },
  iconDisabled: {
    cursor: 'auto',
    color: theme.colors.neutralDarker,
    '&:hover': {
      opacity: 1,
    },
  },
  tooltipContainer: {
    position: 'absolute',
    transition: 'all 500ms linear',
    bottom: '-270%',
    transform: 'translateX(-50%)',
    marginTop: spacers.large,
    zIndex: 999,
  },
  tooltipOnHover: {
    display: 'none',

    '&:hover': {
      display: 'block',
    },
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
