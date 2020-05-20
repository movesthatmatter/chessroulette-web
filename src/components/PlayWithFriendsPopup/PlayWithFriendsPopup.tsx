import { ColoredButton } from 'src/components/ColoredButton/ColoredButton';
import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';
import cx from 'classnames';
import { CustomInput } from './CustomInput/CustomInput';

type Props = {
  close: () => void;
  dispatchCodeJoin: (value: string) => void;
  dispatchCreate: () => void;
};

export const PlayWithFriendsPopup: React.FC<Props> = ({
  dispatchCodeJoin,
  dispatchCreate,
}) => {
  const cls = useStyle();
  const [inputValue, setInputValue] = useState('');
  return (
    <div className={cx(cls.container)}>
      <div className={cls.top}>
        <div className={cls.codeInputContainer}>
          <CustomInput
            className={cls.input}
            value={inputValue}
            onChange={(val: string) => setInputValue(val)}
          />
        </div>
      </div>
      <div className={cls.grid}>
        <div className={cls.side}>
          <Mutunachi
            mid={3}
            className={cls.mutunachi}
          />
        </div>
        <div className={cls.middle}>
          <div>
            <ColoredButton
              className={cls.button}
              label="Join"
              color="#0BCE82"
              width="140px"
              borderRadius="16px"
              onClickFunction={() => {
                dispatchCodeJoin(inputValue);
              }}
            />
          </div>
          <div>
            <ColoredButton
              className={cls.button}
              label="Create new"
              color="#E66162"
              width="140px"
              borderRadius="17px"
              onClickFunction={dispatchCreate}
            />
          </div>
        </div>
        <div className={cls.side}>
          <Mutunachi
            mid={16}
            className={cls.mutunachi}
          />
        </div>
      </div>
    </div>
  );
};

const useStyle = createUseStyles({
  container: {
    maxWidth: '500px',
    fontFamily: 'Open Sans',
    fontSize: '16px',
    textAlign: 'center',

    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
  },
  middle: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',

    margin: '0 5px',
  },
  side: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    marginBottom: '15px',
    borderRadius: '8px',
  },
  codeInputContainer: {
    alignSelf: 'center',
  },
  input: {
    width: '200px',
    borderRadius: '8px',
  },
  mutunachi: {
    width: '120px',
  },
  top: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  grid: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
});
