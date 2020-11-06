import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
// import { setUser } from 'src/services/Authentication';
import { noop } from 'src/lib/util';
import { Onboarding } from './Onboarding';

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      // TO NOTE: Removed on Sep 8th when I worked on authentication
      onSetUser: noop,
    },
    dispatch
  );

export const OnboardingContainer = connect(
  undefined,
  mapDispatchToProps
)(Onboarding);
