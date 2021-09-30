import { useDispatch, useSelector } from "react-redux";
import { switchThemeAction } from "../redux/actions";
import { selectTheme } from "../redux/selectors";
import {ThemeState} from 'src/theme/redux/reducer';
import { CustomTheme, darkTheme, lightTheme } from "..";

export const useColorTheme = () : {
  themeName: ThemeState['theme'],
  theme: CustomTheme,
  switchTheme: () => void;
} => {
  const theme = useSelector(selectTheme);
  const dispatch = useDispatch();


  const switchTheme = () => {
    dispatch(switchThemeAction());
  }

  return {
    themeName: theme,
    theme: theme === 'light' ? lightTheme : darkTheme,
    switchTheme
  }
}