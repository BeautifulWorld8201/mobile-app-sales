import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useSelector, useDispatch } from "react-redux";

import Signin from "../screens/Signin";
import Register from "../screens/Register";

import MakeSale from "../screens/MakeSale";
import Settings from "../screens/Settings";
// import Sale from "../screens/Sale";

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();
function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Signin"
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
        gestureEnabled: true,
        animationEnabled: true,
        unmountOnBlur: true,
      })}
    >
      <Stack.Screen name="Signin" component={Signin} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

function TabStack() {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
        gestureEnabled: true,
        unmountOnBlur: true,
      })}
    >
      <Tab.Screen
        name="MakeSale"
        component={MakeSale}
        options={({ route }) => ({
          tabBarLabel: "Home",

          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon name="home" color={color} />
          ),
          tabBarActiveTintColor: "#f5c634",
        })}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={({ route }) => ({
          tabBarLabel: "Settings",

          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon name="gears" color={color} />
          ),
          tabBarActiveTintColor: "#f5c634",
        })}
      />
    </Tab.Navigator>
  );
}
function AppStack() {
  return (
    <Stack.Navigator
      // initialRouteName="TabStack"
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
      })}
    >
      <Stack.Screen name="TabStack" component={TabStack} />
      {/* <Stack.Screen name="Sale" component={Sale} /> */}
    </Stack.Navigator>
  );
}

export default function StackNavigator() {
  const loginUser = useSelector((state) => state?.auth?.loginUser);

  return (
    <Stack.Navigator
      // initialRouteName="AuthStack"
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
        gestureEnabled: true,
        animationEnabled: true,
      })}
    >
      {loginUser && Object.keys(loginUser).length === 0 ? (
        <Stack.Screen name="AuthStack" component={AuthStack} />
      ) : (
        <Stack.Screen name="AppStack" component={AppStack} />
      )}
    </Stack.Navigator>
  );
}
