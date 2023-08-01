import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';

import Signin from '../screens/Signin';
import Register from '../screens/Register';
import IdentityVerification from '../screens/IdentityVerification';

import MakeSale from '../screens/MakeSale';
import SaleDetail from '../screens/SaleDetail';
import Settings from '../screens/Settings';
import Sale from '../screens/Sale';
import TakePayment from '../screens/TakePayment';
import Referrals from '../screens/Referrals';

import WriteCards from '../screens/WriteCards';
import Payouts from '../screens/Payouts';
import BankDetail from '../screens/BankDetail';

import UserPayouts from '../screens/UserPayouts';
import ChangeCurrency from '../screens/ChangeCurrency';
import NotificationScreen from '../screens/Notifications';
import Partners from '../screens/Partners';
import PartnerDetail from '../screens/PartnerDetail';
import {
	useGetUserEmployeeQuery,
	useUpdateNotificationSettingsMutation,
} from '../../redux/user/userApiSlice';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
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
import { useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native';
import { setReferralCode } from '../../redux/auth/authSlice';
import { scheduleSaleReminderNotification } from '../../utils/notifications';

function TabStack(props: any) {
	const { t } = useTranslation();
	const { data: employeeData } = useGetUserEmployeeQuery();
	const responseListener = React.useRef<any>();

	useEffect(() => {
		responseListener.current = Notifications.addNotificationResponseReceivedListener(
			(response) => {
				const data = response?.notification?.request?.content?.data;
				if (!data) return;
				if (data.type === 'clientPayment') {
					// navigate to SaleDetail page and pass the sale
					props.navigation.navigate('SaleDetail', { sale: data.sale });
				} else if (data.type === 'userReferred') {
					props.navigation.navigate('Referrals');
				}
			}
		);

		return () => {
			Notifications.removeNotificationSubscription(responseListener.current);
		};
	}, []);

	useEffect(() => {
		scheduleSaleReminderNotification();
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
				name="Referrals"
				component={Referrals}
				options={({ route }) => ({
					tabBarLabel: t('Referrals'),

					tabBarIcon: ({ focused, color }) => (
						<MIcons
							name="cash-multiple"
							color={color}
							size={28}
							style={{ marginBottom: -3 }}
						/>
					),
					tabBarActiveTintColor: '#f5c634',
				})}
			/>
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

export default function StackNavigator(props: any) {
	const loginUser = useSelector((state) => state?.auth?.loginUser);
	const refreshToken = useSelector((state) => state?.auth?.refreshToken);
	const expoPushToken = useSelector((state) => state?.user?.expoPushToken);
	const dispatch = useDispatch();

	const [updateNotificationSettings] = useUpdateNotificationSettingsMutation();

	async function registerForPushNotificationsAsync() {
		let token;
		console.log('isDevice', isDevice);
		if (isDevice) {
			const { status: existingStatus } = await Notifications.getPermissionsAsync();
			let finalStatus = existingStatus;
			console.log('existingStatus', existingStatus);

			if (existingStatus !== 'granted') {
				const { status } = await Notifications.requestPermissionsAsync();
				finalStatus = status;
				console.log('FinalStatus', finalStatus);
			}
			if (finalStatus !== 'granted') {
				return;
			}
			try {
				token = await Notifications.getExpoPushTokenAsync({
					projectId: Constants.expoConfig.extra.eas.projectId,
				});
				console.log('Token', token.data);
			} catch (error) {
				console.log('Error fatch Token', error);
			}
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
		if (refreshToken?.token) {
			console.log('registering notification');
			registerForPushNotificationsAsync().then(async (token) => {
				console.log('token is', token);
				if (!expoPushToken || expoPushToken !== token) {
					try {
						await updateNotificationSettings({ expoPushToken: token });
						dispatch(setExpoPushToken(token));
					} catch (error) {
						console.log(error);
					}
				}
			});
		}
	}, [refreshToken?.token]);

	React.useEffect(() => {
		const handleDeepLink = ({ url }: { url: string }) => {
			const route = url.replace(/.*?:\/\//g, '');

			if (route?.startsWith('join')) {
				console.log('route', route);
				const referralCode = route.split('/')[1];
				// set referral code to redux
				dispatch(setReferralCode(referralCode));
			}
		};

		Linking.addEventListener('url', handleDeepLink);

		return () => {
			Linking.removeAllListeners('url');
		};
	}, []);

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
