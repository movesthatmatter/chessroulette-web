/* eslint-disable import/no-extraneous-dependencies */
import { action } from '@storybook/addon-actions';
import React from 'react';
import { IconButton } from './IconButton';
import { Upload, Achievement, BackTen, Validate, SafariOption, Gremlin } from 'grommet-icons';
import { delay } from 'src/lib/time';
import { Swap, Chart, Category, Buy, Send, Game } from 'react-iconly';

export default {
  component: IconButton,
  title: 'components/Button/IconButton',
};

export const defaultStory = () => (
  <>
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
      }}
    >
      <div
        style={{
          width: '100px',
          // padding: '0 32px',
        }}
      >
        <h6>Default</h6>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="primary"
            onSubmit={action('on submit')}
            iconType="grommet"
            icon={Achievement}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="secondary"
            onSubmit={action('on submit')}
            iconType="grommet"
            icon={Achievement}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="attention"
            onSubmit={action('on submit')}
            iconType="grommet"
            icon={BackTen}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="positive"
            onSubmit={action('on submit')}
            iconType="grommet"
            icon={Validate}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="negative"
            onSubmit={action('on submit')}
            iconType="grommet"
            icon={SafariOption}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            disabled
            type="primary"
            onSubmit={action('on submit')}
            iconType="grommet"
            icon={Gremlin}
          />
        </div>
      </div>
      <div
        style={{
          width: '100px',
          // padding: '0 32px',
        }}
      >
        <h6>Clear</h6>
        <div style={{ marginBottom: '16px' }}>
          <IconButton
            type="primary"
            clear
            onSubmit={action('on submit')}
            iconType="grommet"
            icon={Achievement}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <IconButton
            type="secondary"
            clear
            onSubmit={action('on submit')}
            iconType="grommet"
            icon={Achievement}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="attention"
            clear
            onSubmit={action('on submit')}
            iconType="grommet"
            icon={BackTen}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="positive"
            clear
            onSubmit={action('on submit')}
            iconType="grommet"
            icon={Validate}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="negative"
            clear
            onSubmit={action('on submit')}
            iconType="grommet"
            icon={SafariOption}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            disabled
            type="primary"
            clear
            onSubmit={action('on submit')}
            iconType="grommet"
            icon={Gremlin}
          />
        </div>
      </div>
      <div
        style={{
          width: '100px',
          // padding: '0 32px',
        }}
      >
        <h6>With Loader</h6>
        <div style={{ marginBottom: '16px' }}>
          <IconButton
            type="primary"
            withLoader
            iconType="grommet"
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            icon={Achievement}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <IconButton
            type="secondary"
            withLoader
            iconType="grommet"
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            icon={Achievement}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="attention"
            withLoader
            iconType="grommet"
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            icon={BackTen}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="positive"
            withLoader
            iconType="grommet"
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            icon={Validate}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="negative"
            withLoader
            iconType="grommet"
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            icon={SafariOption}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            disabled
            iconType="grommet"
            type="primary"
            withLoader
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            icon={Gremlin}
          />
        </div>
      </div>
      <div
        style={{
          width: '120px',
          // padding: '0 32px',
        }}
      >
        <h6>Clear With Loader</h6>
        <div style={{ marginBottom: '16px' }}>
          <IconButton
            type="primary"
            iconType="grommet"
            withLoader
            clear
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            icon={Achievement}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <IconButton
            type="secondary"
            iconType="grommet"
            withLoader
            clear
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            icon={Achievement}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="attention"
            iconType="grommet"
            withLoader
            clear
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            icon={BackTen}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="positive"
            iconType="grommet"
            withLoader
            clear
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            icon={Validate}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="negative"
            iconType="grommet"
            withLoader
            clear
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            icon={SafariOption}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            disabled
            iconType="grommet"
            type="primary"
            withLoader
            clear
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            icon={Gremlin}
          />
        </div>
      </div>
    </div>
    <h5
      style={{
        // margin: 0,
        // padding: 0,
        marginBottom: 0,
        lineHeight: '1em',
      }}
    >
      Iconly
    </h5>
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
      }}
    >
      <div
        style={{
          width: '100px',
          // padding: '0 32px',
        }}
      >
        <h6
          style={{
            lineHeight: '1em',
            marginBottom: '.5em',
            marginTop: '1em',
          }}
        >
          Default
        </h6>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton type="primary" onSubmit={action('on submit')} iconType="iconly" icon={Swap} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <IconButton
            type="secondary"
            onSubmit={action('on submit')}
            iconType="iconly"
            icon={Game}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="attention"
            onSubmit={action('on submit')}
            iconType="iconly"
            icon={Chart}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton type="positive" onSubmit={action('on submit')} iconType="iconly" icon={Buy} />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="negative"
            onSubmit={action('on submit')}
            iconType="iconly"
            icon={Send}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            disabled
            type="primary"
            onSubmit={action('on submit')}
            iconType="iconly"
            icon={Category}
          />
        </div>
      </div>
      <div
        style={{
          width: '100px',
          // padding: '0 32px',
        }}
      >
        <h6
          style={{
            lineHeight: '1em',
            marginBottom: '.5em',
            marginTop: '1em',
          }}
        >
          Clear
        </h6>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="primary"
            clear
            onSubmit={action('on submit')}
            iconType="iconly"
            icon={Swap}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <IconButton
            type="secondary"
            clear
            onSubmit={action('on submit')}
            iconType="iconly"
            icon={Game}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="attention"
            clear
            onSubmit={action('on submit')}
            iconType="iconly"
            icon={Chart}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="positive"
            clear
            onSubmit={action('on submit')}
            iconType="iconly"
            icon={Buy}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="negative"
            clear
            onSubmit={action('on submit')}
            iconType="iconly"
            icon={Send}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            disabled
            type="primary"
            clear
            onSubmit={action('on submit')}
            iconType="iconly"
            icon={Category}
          />
        </div>
      </div>
      <div
        style={{
          width: '100px',
          // padding: '0 32px',
        }}
      >
        <h6
          style={{
            lineHeight: '1em',
            marginBottom: '.5em',
            marginTop: '1em',
          }}
        >
          With Loader
        </h6>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="primary"
            withLoader
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            iconType="iconly"
            icon={Swap}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <IconButton
            type="secondary"
            withLoader
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            iconType="iconly"
            icon={Game}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="attention"
            withLoader
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            iconType="iconly"
            icon={Chart}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="positive"
            withLoader
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            iconType="iconly"
            icon={Buy}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="negative"
            withLoader
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            iconType="iconly"
            icon={Send}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            disabled
            type="primary"
            withLoader
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            iconType="iconly"
            icon={Category}
          />
        </div>
      </div>
      <div
        style={{
          width: '150px',
          // padding: '0 32px',
        }}
      >
        <h6
          style={{
            lineHeight: '1em',
            marginBottom: '.5em',
            marginTop: '1em',
          }}
        >
          Clear With Loader
        </h6>
        <div style={{ marginBottom: '16px' }}>
          <IconButton
            type="primary"
            withLoader
            clear
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            iconType="iconly"
            icon={Swap}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <IconButton
            type="secondary"
            withLoader
            clear
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            iconType="iconly"
            icon={Game}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="attention"
            withLoader
            clear
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            iconType="iconly"
            icon={Chart}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="positive"
            withLoader
            clear
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            iconType="iconly"
            icon={Buy}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="negative"
            withLoader
            clear
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            iconType="iconly"
            icon={Send}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            disabled
            type="primary"
            withLoader
            clear
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            iconType="iconly"
            icon={Category}
          />
        </div>
      </div>
    </div>
  </>
);
