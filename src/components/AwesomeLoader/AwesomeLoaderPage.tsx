import React from 'react';
import config from 'src/config';
import { createUseStyles } from 'src/lib/jss';
import { Page, PageProps } from '../Page';
import { AwesomeLoader } from './AwesomeLoader';

type Props = {
  stretched?: PageProps['stretched'];
};

export const AwesomeLoaderPage: React.FC<Props> = ({ ...pageProps }) => {
  const cls = useStyles();

  return (
    <Page name={config.TITLE_SUFFIX} {...pageProps}>
      <div className={cls.container}>
        <div style={{ width: '300px' }}>
          <AwesomeLoader />
        </div>
      </div>
    </Page>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    color: theme.text.baseColor,
  },
}));
