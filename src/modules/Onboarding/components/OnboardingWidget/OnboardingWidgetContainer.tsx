import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { setUser } from 'src/services/Authentication';
import { OnboardingWidget } from './OnboardingWidget';

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  onSetUser: setUser,
}, dispatch);

export const OnboardingWidgetContainer = connect(
  undefined,
  mapDispatchToProps,
)(OnboardingWidget);
