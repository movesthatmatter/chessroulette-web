import React from 'react';
import { Page } from 'src/components/Page';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import { fonts, text } from 'src/theme';
import { html } from './policyHTML';

type Props = {};

export const PrivacyPolicy: React.FC<Props> = () => {
  const cls = useStyles();

  return (
    <Page title="Privacy Policy" name="Privacy Policy">
      <div className={cls.container}>
        <article
          className={cls.article}
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        ></article>
      </div>
    </Page>
  );
};

const useStyles = createUseStyles({
  container: {},
  article: {
    ...{
      color: text.baseColor,

      '& p': {
        ...fonts.body1,
        textAlign: 'justify',
      },
      '& h2': {
        fontSize: '24px',
        lineHeight: '32px',
        marginTop: '80px',
      },
      '& table': {
        width: '100%',
      },
      '& th': {
        ...fonts.subtitle1,
        paddingBottom: '.7em',
        textAlign: 'left',
      },
      '& td': {
        ...fonts.body2,
        verticalAlign: 'top',
        marginBottom: '.7em',
      },
      '& td ul': {
        marginLeft: 0,
        paddingLeft: '18px',
      },
      '& td li': {
        ...fonts.body2,
        marginBottom: '1em',
      },
      '& li': {
        ...fonts.body2,
        marginBottom: '1em',
      },
    } as CSSProperties['nestedKey'],
  },
});
