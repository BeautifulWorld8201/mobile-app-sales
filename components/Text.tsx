import React from "react";
import { Text, StyleSheet } from "react-native";
// import { useThemeAwareObject } from "theme";
import { hp, wp } from "../utils";
export default function CustomText({
  children,
  style,
  onPress,
  numberOfLines,
}) {
  // const createStyles = (theme) => {

  // };

  // const styles = useThemeAwareObject(createStyles);
  return (
    <Text
      style={[styles.text, style]}
      allowFontScaling={false}
      onPress={onPress}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
}
const styles = StyleSheet.create({
  text: {
    color: "black",
  },
});
