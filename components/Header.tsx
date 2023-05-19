import { Image, StyleSheet, View } from "react-native";
import React from "react";
import { hp, wp } from "../utils";
import { Header } from "@rneui/themed";

import { tintColorDark } from "../constants/Colors";
import Text from "../components/Text";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

export default function CustomHeader(props: any) {
  return (
    <Header
      barStyle={"dark-content"}
      statusBarProps={{ translucent: true, backgroundColor: "transparent" }}
      containerStyle={styles.container}
      centerComponent={<Text style={styles.headerText}>{props.title}</Text>}
      leftComponent={
        <Icon
          name={"arrow-left"}
          color={"white"}
          size={20}
          onPress={props.leftButton}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    height: hp(13),
    backgroundColor: tintColorDark,
    borderBottomColor: tintColorDark,
    borderBottomLeftRadius: hp(3),
    borderBottomRightRadius: hp(3),
  },
  headerText: {
    color: "white",
    fontWeight: "700",
    fontSize: hp(2.25),
    // marginTop: 5,
  },
});
