import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useSelector, useDispatch } from "react-redux";

import Signin from "../screens/Signin";
import Register from "../screens/Register";
import IdentityVerification from "../screens/IdentityVerification";

import MakeSale from "../screens/MakeSale";
import SaleDetail from "../screens/SaleDetail";
import Settings from "../screens/Settings";
import Sale from "../screens/Sale";
import TakePayment from "../screens/TakePayment";

import WriteCards from "../screens/WriteCards";
import Payouts from "../screens/Payouts";
import BankDetail from "../screens/BankDetail";

import UserPayouts from "../screens/UserPayouts";
import ChangeCurrency from "../screens/ChangeCurrency"
const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();
function AuthStack() {
  const accessToken = useSelector((state) => state?.auth?.accessToken?.token);

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
      {accessToken == undefined && (
        <>
          <Stack.Screen name="Signin" component={Signin} />
          <Stack.Screen name="Register" component={Register} />
        </>
      )}
      <Stack.Screen
        name="IdentityVerification"
        component={IdentityVerification}
      />
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
        unmountOnBlur: false,
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
      initialRouteName="TabStack"
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
      })}
    >
      <Stack.Screen name="TabStack" component={TabStack} />
      <Stack.Screen name="Sale" component={Sale} />
      <Stack.Screen name="TakePayment" component={TakePayment} />
      <Stack.Screen name="WriteCards" component={WriteCards} />

      <Stack.Screen name="SaleDetail" component={SaleDetail} />
      <Stack.Screen name="UserPayouts" component={UserPayouts} />
      <Stack.Screen name="Payouts" component={Payouts} />
      <Stack.Screen name="BankDetail" component={BankDetail} />
      <Stack.Screen name="ChangeCurrency" component={ChangeCurrency} />
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
