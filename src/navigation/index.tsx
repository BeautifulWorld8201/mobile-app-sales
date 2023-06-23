import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';

import Signin from '../screens/Signin';
import Register from '../screens/Register';
import IdentityVerification from '../screens/IdentityVerification';

import MakeSale from '../screens/MakeSale';
import SaleDetail from '../screens/SaleDetail';
import Settings from '../screens/Settings';
import Sale from '../screens/Sale';
import TakePayment from '../screens/TakePayment';

import WriteCards from '../screens/WriteCards';
import Payouts from '../screens/Payouts';
import BankDetail from '../screens/BankDetail';

import UserPayouts from '../screens/UserPayouts';
import ChangeCurrency from '../screens/ChangeCurrency';
import NotificationScreen from '../screens/Notifications';
import Partners from '../screens/Partners';
import PartnerDetail from '../screens/PartnerDetail';
import { useGetUserEmployeeQuery, useUpdateNotificationSettingsMutation } from '../../redux/user/userApiSlice';
import * as Notifications from 'expo-notifications';

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
					<Stack.Screen name="ForgotPassword" component={ForgotPassword} />
				</>
			)}
			<Stack.Screen name="IdentityVerification" component={IdentityVerification} />
		</Stack.Navigator>
	);
}
function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>['name'];
	color: string;
}) {
	return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}
import { useTranslation } from 'react-i18next';
import ForgotPassword from '../screens/ForgotPassword';
import { isDevice } from 'expo-device';
import { Platform } from 'react-native';
import { setExpoPushToken } from '../../redux/user/userSlice';

function TabStack() {
	const { t } = useTranslation();
	const expoPushToken = useSelector((state) => state?.user?.expoPushToken);
	const dispatch = useDispatch();

	const { data: employeeData } = useGetUserEmployeeQuery();
	const [updateNotificationSettings] = useUpdateNotificationSettingsMutation();

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
		registerForPushNotificationsAsync().then(async(token) => {
			if (!expoPushToken || expoPushToken !== token) {
				try {
					await updateNotificationSettings({ expoPushToken: token });
					dispatch(setExpoPushToken(token));
				} catch (error) {
					console.log(error);
				}
			}
		});
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
					tabBarLabel: t('Home'),

					tabBarIcon: ({ focused, color }) => <TabBarIcon name="home" color={color} />,
					tabBarActiveTintColor: '#f5c634',
				})}
			/>
			{employeeData?.length ? (
				<Tab.Screen
					name="Partners"
					component={Partners}
					options={({ route }) => ({
						tabBarLabel: t('Partners'),

						tabBarIcon: ({ focused, color }) => (
							<TabBarIcon name="group" color={color} />
						),
						tabBarActiveTintColor: '#f5c634',
					})}
				/>
			) : null}
			<Tab.Screen
				name="Settings"
				component={Settings}
				options={({ route }) => ({
					tabBarLabel: t('Settings'),

					tabBarIcon: ({ focused, color }) => <TabBarIcon name="gears" color={color} />,
					tabBarActiveTintColor: '#f5c634',
				})}
			/>
		</Tab.Navigator>
	);
}

function AppStack() {
	return (
		<Stack.Navigator
			initialRouteName={'TabStack'}
			screenOptions={({ route, navigation }) => ({
				headerShown: false,
			})}
		>
			<Stack.Screen name="TabStack" component={TabStack} />
			<Stack.Screen name="Sale" component={Sale} />
			<Stack.Screen name="TakePayment" component={TakePayment} />
			<Stack.Screen name="WriteCards" component={WriteCards} />

			<Stack.Screen name="SaleDetail" component={SaleDetail} />
			<Stack.Screen name="Partners" component={Partners} />
			<Stack.Screen name="PartnerDetail" component={PartnerDetail} />
			<Stack.Screen name="UserPayouts" component={UserPayouts} />
			<Stack.Screen name="Payouts" component={Payouts} />
			<Stack.Screen name="BankDetail" component={BankDetail} />
			<Stack.Screen name="Notifications" component={NotificationScreen} />
			{/* <Stack.Screen name="ChangeCurrency" component={ChangeCurrency} /> */}
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
