import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Text from "./Text";

import Icon from "@expo/vector-icons/MaterialCommunityIcons";

export default function Button(props) {
  return (
    <TouchableOpacity
      activeOpacity={props.activeOpacity ? 1 : 0.2}
      style={{
        ...props.style,
        flexDirection: props.flexDirection,
      }}
      onPress={props.onPress}
      disabled={props.disabled}
    >
      {props.isLoading ? (
        <ActivityIndicator size="small" color={props.loaderColor.color} />
      ) : (
        <>
          {props.icon && props.icon}
          {props.children}
        </>
      )}
    </TouchableOpacity>
  );
}
