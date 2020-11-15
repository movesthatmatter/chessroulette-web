import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Mutunachi } from '../Mutunachi/Mutunachi';
import { AspectRatio, AspectRatioProps } from '../AspectRatio';
import { Box } from 'grommet';
import { Text } from 'src/components/Text';

const errorsMap = {
  resourceNotFound: {
    message: '404',
    mid: '5',
  },
  genericError: {
    message: 'Ooops. Something went wrong!',
    mid: '3',
  },
};

export type AwesomeErrorProps = AspectRatioProps & {
  minimal?: boolean;
  errorType?: keyof typeof errorsMap;
};

export const AwesomeError: React.FC<AwesomeErrorProps> = ({
  aspectRatio = { width: 1, height: 1 },
  minimal,
  errorType = 'genericError',
}) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      <AspectRatio
        aspectRatio={aspectRatio}
        className={cls.mutunachiContainer}
      >
        <Mutunachi
          mid={errorsMap[errorType].mid}
          className={cls.mutunachi}
        />
      </AspectRatio>
      {minimal || (
        <Box pad="small">
          <Text className={cls.text}>
            {errorsMap[errorType].message}
          </Text>
        </Box>
      )}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    width: '100%',
    textAlign: 'center',
  },
  mutunachiContainer: {
    width: '60%',
    margin: '0 auto',
  },
  mutunachi: {
    height: '100%',
  },

  '@keyframes pulse': {
    '0%': {
      opacity: 0.3,
    },

    '50%': {
      opacity: 0.95,
    },

    '100%': {
      opacity: 0.3,
    },
  },
  text: {
    fontSize: '18px',
    fontWeight: 'normal',
  },
});
