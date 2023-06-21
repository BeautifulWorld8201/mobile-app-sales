import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { View, Text, Platform } from 'react-native';
import { SafeAreaView } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { PersistGate } from 'redux-persist/integration/react';
import StackNavigator from './src/navigation';
import { store, persistor } from './redux/store';
import { RootSiblingParent } from 'react-native-root-siblings';
import * as Notifications from 'expo-notifications';

import './i18n.config';
import { isDevice } from 'expo-device';

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

const App = () => {
	const responseListener = React.useRef<any>();

	async function registerForPushNotificationsAsync() {
		let token;
		if (isDevice) {
			const { status: existingStatus } = await Notifications.getPermissionsAsync();
			let finalStatus = existingStatus;
			if (existingStatus !== 'granted') {
				const { status } = await Notifications.requestPermissionsAsync();
				finalStatus = status;
			}
			if (finalStatus !== 'granted') {
				return;
			}
			token = (await Notifications.getExpoPushTokenAsync()).data;
			console.log(token);
		} else {
			alert('Must use physical device for Push Notifications');
		}

		if (Platform.OS === 'android') {
			Notifications.setNotificationChannelAsync('default', {
				name: 'default',
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: '#FF231F7C',
			});
		}

		return token;
	}

	useEffect(() => {
		// registerForPushNotificationsAsync().then((token) => console.log(token));
		responseListener.current = Notifications.addNotificationResponseReceivedListener(
			(response) => {
				const data = response?.notification?.request?.content?.data;
				if (!data) return;

			}
		);

		return () => {
			Notifications.removeNotificationSubscription(responseListener.current);
		};
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
