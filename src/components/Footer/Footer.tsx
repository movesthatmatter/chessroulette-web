import { Box } from 'grommet';
import React from 'react';
import { fonts } from 'src/theme';
import { Text } from '../Text';

type Props = {};

export const Footer: React.FC<Props> = () => {
  return (
    <div>
      <Box
        fill
        align="center"
        direction="row"
        style={{
          height: '100%',
        }}
      >
        <Box
          align="center"
          justify="center"
          style={{
            flex: 1,
          }}
        >
          <Text
            style={{
              ...fonts.small2,
              fontWeight: 200,
            }}
          >
            Made with ❤️ around the world!
          </Text>
        </Box>
      </Box>
    </div>
  );
};
