import { useDispatch, useSelector } from "react-redux";
import { switchThemeAction } from "../redux/actions";
import { selectTheme } from "../redux/selectors";
import { CustomTheme, themes } from "..";

export const useColorTheme = () : {
  theme: CustomTheme,
  switchTheme: () => void;
} => {
  const theme = useSelector(selectTheme);
  const dispatch = useDispatch();


  const switchTheme = () => {
    dispatch(switchThemeAction());
  }
 
  return {
    theme: theme === 'lightDefault' ? themes.lightDefault : themes.darkDefault,
    switchTheme
  }
}