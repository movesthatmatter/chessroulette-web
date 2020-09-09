import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { noop } from 'src/lib/util';
import { OnboardingWidget } from './OnboardingWidget';

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      // TO NOTE: Removed on Sep 8th when I worked on authentication
      // onSetUser: noop,
    },
    dispatch
  );

export const OnboardingWidgetContainer = connect(
  undefined,
  mapDispatchToProps
)(OnboardingWidget);
