import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { View, Text, Platform } from "react-native";
import { SafeAreaView } from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { PersistGate } from "redux-persist/integration/react";
import StackNavigator from "./src/navigation";
import { store, persistor } from "./redux/store";
import { RootSiblingParent } from "react-native-root-siblings";
import * as Notifications from "expo-notifications";

import "./i18n.config";
import { isDevice } from "expo-device";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const App = () => {
  return (
    <RootSiblingParent>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <StackNavigator />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </RootSiblingParent>
  );
};

export default App;
