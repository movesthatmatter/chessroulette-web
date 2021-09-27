import { useDispatch, useSelector } from "react-redux";
import { switchThemeAction } from "../redux/actions";
import { selectTheme } from "../redux/selectors";
import {ThemeState} from 'src/theme/redux/reducer';
import { console } from "window-or-global";
import { useEffect } from "react";

export const useLightDarkMode = () : {
  theme: ThemeState['theme'],
  switchTheme: () => void;
} => {
  const theme = useSelector(selectTheme);
  const dispatch = useDispatch();

  useEffect(() => {console.log('new themee', theme)}, [theme])

  const switchTheme = () => {
    console.log('switch theme')
    dispatch(switchThemeAction());
  }

  return {
    theme,
    switchTheme
  }
}