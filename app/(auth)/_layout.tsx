import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Stack } from "expo-router";
import { Pressable, useColorScheme } from "react-native";

import Colors from "../../constants/Colors";

export default function Auth(props: any) {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
      })}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* <Stack.Screen name="modal" options={{ presentation: "modal" }} /> */}
    </Stack>
  );
}
