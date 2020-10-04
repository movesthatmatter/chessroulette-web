import React from 'react';
import { Page } from 'src/components/Page';
import { Box } from 'grommet';
import { useHistory } from 'react-router-dom';
import { selectAuthentication } from 'src/services/Authentication';
import { useSelector } from 'react-redux';
import { ChallengeButtonWidget } from 'src/modules/Games/Chess/components/ChallengeButtonWidget';

type Props = {};

export const LandingPageV2: React.FC<Props> = () => {
  const authentication = useSelector(selectAuthentication);
  const history = useHistory();

  // This should never happen
  if (authentication.authenticationType === 'none') {
    return null;
  }

  return (
    <Page>
      <Box>
        <Box width="medium" alignSelf="center">
          <ChallengeButtonWidget 
            buttonLabel="Play a Friend"
            userId={authentication.user.id}
            type='challenge'
          />
          <ChallengeButtonWidget 
            buttonLabel="Quick Game"
            userId={authentication.user.id}
            type='quickPairing'
          />
        </Box>
      </Box>
    </Page>
  );
};
