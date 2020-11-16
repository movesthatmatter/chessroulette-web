import React, { Component } from 'react';
import ReactGA, { InitializeOptions } from 'react-ga';
import { Route } from 'react-router-dom';
import config from 'src/config';

type Props = {
  location: {
    pathname: string;
    search: string;
  };
  options: object;
};

class GoogleAnalytics extends Component<Props> {
  componentDidMount() {
    this.logPageChange(
      this.props.location.pathname,
      this.props.location.search,
    );
  }

  componentDidUpdate({ location: prevLocation }: Props) {
    const {
      location: { pathname, search },
    } = this.props;
    const isDifferentPathname = pathname !== prevLocation.pathname;
    const isDifferentSearch = search !== prevLocation.search;

    if (isDifferentPathname || isDifferentSearch) {
      this.logPageChange(pathname, search);
    }
  }

  logPageChange(pathname: string, search = '') {
    const page = pathname + search;
    const { location } = window;
    ReactGA.set({
      page,
      location: `${location.origin}${page}`,
      ...this.props.options,
    });
    ReactGA.pageview(page);
  }

  render() {
    return null;
  }
}

const RouteTracker = () => <Route component={GoogleAnalytics} />;

const init = (options: InitializeOptions = {}) => {
  const isGAEnabled = config.ENV === 'production' || config.ENV === 'staging';

  if (isGAEnabled) {
    ReactGA.initialize(config.GOOGLE_ANALYTICS_TRACKING_ID, {
      // debug: config.DEBUG,
      ...options,
    });
  }

  return isGAEnabled;
};

export const GA = {
  GoogleAnalytics,
  RouteTracker,
  init,
};
