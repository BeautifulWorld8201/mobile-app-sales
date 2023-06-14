import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { View, Text, LogBox } from "react-native";
import { SafeAreaView } from "react-native";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { PersistGate } from "redux-persist/integration/react";
import StackNavigator from "./src/navigation";
import { store, persistor } from "./redux/store";
import { RootSiblingParent } from "react-native-root-siblings";
const App = () => {
  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

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
