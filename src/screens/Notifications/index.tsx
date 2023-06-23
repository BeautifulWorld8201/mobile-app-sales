import {
	StyleSheet,
	View,
	Image,
	Alert,
	TouchableOpacity,
	Switch,
	Linking,
	Platform,
} from 'react-native';
import React, { useEffect } from 'react';
import { hp, wp } from '../../../utils';
import { Text } from '../../../components/Themed';
import Header from '../../../components/Header';
import MIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useIsFocused } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';
import Button from '../../../components/Button';
import { tintColorDark } from '../../../constants/Colors';

const NotificationElement = ({ title, icon, value, onPress }: any) => {
	return (
		<>
			<TouchableOpacity onPress={onPress} style={styles.backgroundView}>
				<View style={styles.rowView}>
					<View style={styles.iconView}>
						<MIcons name={'account-cash'} size={20} />
					</View>
					<Text style={styles.titleText}>{title}</Text>
				</View>
				<Text style={styles.titleText}>
					<Switch value={value} />
				</Text>
			</TouchableOpacity>
			{/* display <View style={styles.divider} /> only if element is not latest */}
		</>
	);
};

export default function NotificationScreen(props: any) {
	const focused = useIsFocused();

	const [notificationGranted, setNotificationGranted] = React.useState(true);

	useEffect(() => {
		(async () => {
			// if permission for notification is not granted, request it again
			const { status } = await Notifications.getPermissionsAsync();
			if (status !== 'granted') {
				await Notifications.requestPermissionsAsync();
				setNotificationGranted(false);
			}
			// get the token that uniquely identifies this device
			const token = (await Notifications.getExpoPushTokenAsync()).data;
			console.log(token);
		})();
	}, []);

	return (
		<>
			<View style={styles.container}>
				<Header title={'Notifications'} leftButton={() => props.navigation.goBack()} />
				{notificationGranted ? (
					<ScrollView style={styles.innerContainer} showsVerticalScrollIndicator={false}>
						<Text style={styles.textTitle}>Notifications</Text>

						<View style={styles.mainContainer}>
							<NotificationElement
								title="Client Payment Received"
								icon="cash-check"
								value={true}
							/>
							<View style={styles.divider} />
							<NotificationElement
								title="User Referred"
								icon="account-cash"
								value={true}
							/>
							<View style={styles.divider} />
							<NotificationElement
								title="Sale Reminder"
								icon="account-cash"
								value={true}
							/>
						</View>
					</ScrollView>
				) : (
					<View
						style={{
							...styles.innerContainer,
							flex: 1,
							alignItems: 'center',
							justifyContent: 'center',
							gap: hp(5),
						}}
					>
						<View>
							<Image
								source={require('../../../assets/images/notification.png')}
								style={{ width: wp(50), height: hp(20) }}
							/>
						</View>
						<Text style={styles.titleText}>
							We need your permission to send notifications
						</Text>
						<Button
							style={styles.button}
							onPress={() => {
								Linking.openSettings();
							}}
						>
							<Text style={styles.buttonText}>Allow Notifications</Text>
						</Button>
					</View>
				)}
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	titleText: {
		fontSize: 16,
		fontWeight: '400',
	},
	textTitle: {
		marginTop: hp(2),
		marginBottom: hp(1),
		fontSize: 12,
		color: '#aaa',
		textTransform: 'uppercase',
		fontWeight: '600',
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
	},
	innerContainer: {
		width: wp(90),
		height: 100,
		alignSelf: 'center',
		marginVertical: hp(1),
	},
	iconsView: {
		justifyContent: 'center',
		backgroundColor: '#F9F9F9',
	},
	backgroundView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#F9F9F9',
	},

	mainContainer: {
		backgroundColor: '#F9F9F9',
		borderRadius: 20,
		padding: hp(2),
		width: wp(90),
	},
	logoutView: {
		backgroundColor: '#F9F9F9',
		borderRadius: 20,
		padding: hp(2),
		width: wp(90),
		marginTop: hp(2),
		alignItems: 'center',
	},
	logoutText: {
		color: '#DF1E1E',
		fontSize: 18,
		fontWeight: '600',
	},

	iconView: {
		width: wp(10),
		backgroundColor: '#F9F9F9',
	},
	divider: {
		height: wp(0.2),
		width: '100%',
		backgroundColor: '#DEDEDE',
		marginVertical: hp(1.2),
	},
	rowView: {
		flexDirection: 'row',
		backgroundColor: '#F9F9F9',
		alignItems: 'center',
	},
	button: {
		backgroundColor: tintColorDark,
		borderRadius: hp(5),
		height: hp(7),
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',

		marginBottom: hp(3),
	},
	buttonText: {
		color: 'white',
		fontSize: hp(2),
		fontWeight: '700',
	},
	buttonContainer: {
		alignItems: 'center',
		// bottom: 0,
		backgroundColor: 'white',
		paddingHorizontal: hp(2.5),
	},
});
