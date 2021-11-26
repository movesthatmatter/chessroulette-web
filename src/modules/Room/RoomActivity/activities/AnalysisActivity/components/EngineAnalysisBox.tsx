import React from 'react';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import { LabeledFloatingBox } from './LabeledFloatingBox';
import cx from 'classnames';
import { spacers } from 'src/theme/spacers';
import { EngineLines } from 'src/modules/Games/Chess/components/EngineAnalysis/EngineLines';
import Loader from 'react-loaders';
import { EngineAnalysisState } from 'src/modules/Games/Chess/components/EngineAnalysis';
import { Text } from 'src/components/Text';

type Props = {
  engineAnalysisState: EngineAnalysisState;
  containerClassName?: string;
  contentClassName?: string;
};

export const EngineAnalysisBox: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <LabeledFloatingBox
      label="Engine Analysis"
      containerClassName={cx(props.containerClassName)}
      floatingBoxClassName={cx(cls.container, props.contentClassName)}
    >
      <div className={cls.scroller}>
        {props.engineAnalysisState.isLoading ? (
          <div className={cls.loaderContainer}>
            <Loader type="ball-pulse" active innerClassName={cls.loader} />
          </div>
        ) : (
          <>
            {props.engineAnalysisState.evaluation ? (
              <EngineLines lines={props.engineAnalysisState.evaluation.info} />
            ) : (
              <Text size="small2">{'Wow So Empty!'}</Text>
            )}
          </>
        )}
      </div>
    </LabeledFloatingBox>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    display: 'flex',
    flex: 1,
    height: '100%',
  },
  top: {
    padding: spacers.smaller,
  },
  scroller: {
    display: 'flex',
    flex: 1,
    overflowY: 'scroll',
    scrollBehavior: 'smooth',
  },
  loaderContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    // minHeight: '100px',

    transform: 'scale(.7)',
    ...({
      '& > div': {
        backgroundColor: theme.colors.primary,
      },
    } as CSSProperties),
  },
}));
