import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { colors, softBorderRadius } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import cx from 'classnames';

type Props = {
  icon: FontAwesomeIconProps['icon'];
  iconProps?: Omit<FontAwesomeIconProps, 'icon'>;
  tooltip?: string;
  onClick?: () => void;
  className?: string;
};

export const ClearIconButton: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      <FontAwesomeIcon
        icon={props.icon}
        size="xs"
        className={cx(cls.icon, props.className)}
        onClick={props.onClick}
        {...props.iconProps}
      />
      {props.tooltip && (
        <div className={cls.tooltipContainer}>
          <div className={cls.tooltipText}>
            <Text size="small1">{props.tooltip}</Text>
          </div>
        </div>
      )}
    </div>
  );
};

const useStyles = createUseStyles({
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
  tooltipContainer: {
    position: 'absolute',
    transition: 'all 500ms linear',
    bottom: '-270%',
    transform: 'translateX(-50%)',
    marginTop: spacers.large,
    zIndex: 999,
  },
  tooltipText: {
    marginLeft: spacers.small,
    border: `1px solid ${colors.neutralDark}`,
    padding: spacers.small,
    lineHeight: 0,
    background: colors.white,
    ...softBorderRadius,
    boxShadow: '0 6px 13px rgba(16, 30, 115, 0.08)',
  },
});
