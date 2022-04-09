import React from 'react';
import config from 'src/config';
import { useHistory } from 'react-router-dom';
import { Page, PageProps } from 'src/components/Page';
import { AuthenticationDialog } from '../../widgets';

type Props = Partial<PageProps> & {};

export const AuthenticationPage: React.FC<Props> = (props) => {
  const history = useHistory();

  return (
    <Page name={`Let's Authenticate ${config.TITLE_SUFFIX}`} {...props}>
      <AuthenticationDialog
        visible
        onClose={() => {
          history.goBack();
        }}
      />
    </Page>
  );
};
