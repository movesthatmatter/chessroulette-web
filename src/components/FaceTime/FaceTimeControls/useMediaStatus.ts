import { useSelector } from "react-redux";
import { selectMediaStatus } from "./redux/selectors";

export const useMediaStatus = () => useSelector(selectMediaStatus);