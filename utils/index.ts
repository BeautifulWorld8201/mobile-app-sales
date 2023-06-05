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

export const formatDateTime = (date: Date | string) => {
  if (!date) return '';
  const messageDate = new Date(date);
  const today = new Date();

  if (messageDate.getFullYear() === today.getFullYear()) {
    if (messageDate.getDate() === today.getDate()) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return messageDate.toLocaleDateString([], {
      day: "numeric",
      month: "short",
    });
  }
  return messageDate.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};