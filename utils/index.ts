import { Dimensions } from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

const { width, height } = Dimensions.get("window");

export const widthSize = width;
export const heightSize = height;

export const wp = (p) => widthPercentageToDP(p);
export const hp = (p) => heightPercentageToDP(p);
