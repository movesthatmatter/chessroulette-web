import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { setUser } from 'src/services/Authentication';
import { Onboarding } from './Onboarding';

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  onSetUser: setUser,
}, dispatch);

export const OnboardingContainer = connect(
  undefined,
  mapDispatchToProps,
)(Onboarding);
