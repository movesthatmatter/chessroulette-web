import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { CustomTheme, fonts, minMediaQuery } from 'src/theme';
import { ButtonProps } from '../Button';
import { Dialog } from '../Dialog';
import { Mutunachi } from '../Mutunachi/Mutunachi';

type Props = {
  buttons: ButtonProps[];
  title: string;
  desc?: string;
  mid: string;
};

export const AwesomeErrorWithAction: React.FC<Props> = ({ buttons, title, desc, mid }) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      <div className={cls.wrapper}>
        <Dialog
          hasCloseButton={false}
          visible
          buttons={buttons}
          content={
            <div>
              <Mutunachi mid={mid} style={{ maxHeight: '200px', marginBottom: '10px' }} />
              <div style={{ textAlign: 'center' }}>
                <div className={cls.title} style={{ marginBottom: '10px' }}>
                  {title}
                </div>
                <div className={cls.foot} style={{ ...fonts.body2 }}>{desc}</div>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};

const useStyles = createUseStyles(theme => ({
  container: {
    display: 'flex',
    height: '100vh',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    width: '100%',
    textAlign: 'center',
    fontSize: '24px',

    ...minMediaQuery(600, {
      fontSize: '48px',
    }),
  },
  textContainer: {
    padding: '16px',
  },
  title: {
    marginBottom: 0,
    color: theme.colors.neutralDarker,
  },
  description: {
    fontSize: '50%',
    color: theme.colors.neutralDarker,
    fontWeight: 400,
  },
  foot: {
    color: theme.colors.neutralDarker
  }
}));
