import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { Text } from 'src/components/Text';
import { FloatingBox, FloatingBoxProps } from 'src/components/FloatingBox';
import { spacers } from 'src/theme/spacers';

type Props = FloatingBoxProps & {
  label: string;
  containerClassName?: string;
  floatingBoxClassName?: string;
  topRightComponent?: React.ReactNode;
};

export const LabeledFloatingBox: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <div className={cx(cls.container, props.containerClassName)}>
      <div className={cls.top}>
        <Text size="small2">{props.label}</Text>
        {props.topRightComponent && <div className={cls.topRightContainer}>
          {props.topRightComponent}
        </div>}
      </div>
      <FloatingBox className={cx(cls.box, props.floatingBoxClassName)}>{props.children}</FloatingBox>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  top: {
    paddingBottom: spacers.smaller,
    display: 'flex',
  },
  box: {
    flex: 1,
  },
  topRightContainer: {
    display: 'flex',
    flex: 1,
    alignContent: 'center',
    justifyItems: 'center',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
