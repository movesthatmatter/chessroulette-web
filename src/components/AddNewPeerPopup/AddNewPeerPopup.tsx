import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Mutunachi } from 'src/components/Mutunachi/Mutunachi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faCopy } from '@fortawesome/free-solid-svg-icons';

import { useLocation } from 'react-router-dom';

type Props = {
  close?: () => void;
}

export const AddNewPeerPopUp: React.FC<Props> = ({
  close,
}) => {
  const cls = useStyle();
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (copied) {
      setInterval(() => {
        setCopied(false);
      }, 1000);
    }
  }, [copied]);
  return (
    <>
      <div className={cls.exitButton}>
        <FontAwesomeIcon
          icon={faTimesCircle}
          size="lg"
          className={cls.exitIcon}
          onClick={close}
        />
      </div>
      <div className={cls.container}>
        <div className={cls.label}>
          Click on the code to copy it and share with your friends
        </div>
        <div className={cls.bottomContainer}>
          <div className={cls.spacer} />
          <div className={cls.codeContainer}>
            <div
              className={cls.code}
              onClick={() => {
                navigator.clipboard.writeText(location.key!);
                setCopied(true);
              }}
            >
              {location.key!}
            </div>
          </div>
          <div className={cls.spacer} />
        </div>
        <div className={cls.urlContainer}>
          <div>
            Or you can simply copy this URL and send it :
          </div>
          <div className={cls.urlPart}>
            <span
              style={{
                color: '#F7627B',
                fontSize: '18px',
                padding: '5px',
              }}
            >
              {`https://chessroulette.now.sh${location.pathname!}${location.key!}`}
            </span>
            <div
              className={cls.copyButton}
              onClick={() => {
                navigator.clipboard.writeText(`https://chessroulette.now.sh${location.pathname!}${location.key!}`);
                setCopied(true);
              }}
            >
              <FontAwesomeIcon
                icon={faCopy}
                size="2x"
                color="#F7627B"
              />
            </div>
          </div>
          {copied && <div style={{ fontFamily: 'Open Sans', color: '#F7627B' }}>Copied!</div>}
        </div>
      </div>
    </>
  );
};

const useStyle = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: '40px 20px',
  },
  label: {
    fontFamily: 'Open Sans',
    fontSize: '18px',
    color: '#3E3E3E',
  },
  spacer: {
    width: '100%',
  },
  bottomContainer: {
    display: 'flex',
    marginTop: '15px',

  },
  urlContainer: {
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Open Sans',
    fontSize: '16px',
    display: 'flex',
    flexDirection: 'column',
    marginTop: '20px',
  },
  codeContainer: {
    backgroundColor: '#F7627B',
    boxShadow: '1px 1px 8px rgba(0, 0, 0, 0.24)',
    borderRadius: '21px',
    fontFamily: 'Open Sans',
    fontWeight: 'bolder',
    color: 'white',
    lineHeight: '41px',
    fontSize: '30px',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  code: {
    padding: '10px',
  },
  exitButton: {
    alignSelf: 'flex-end',
    position: 'absolute',
    right: '5%',
    top: '4%',
  },
  exitIcon: {
    color: '#E66162',
    cursor: 'pointer',
  },
  urlPart: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
  },
  copyButton: {
    marginLeft: '20px',
    '&:hover': {
      cursor: 'pointer',
    },
  },
});
