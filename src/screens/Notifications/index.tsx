import { StyleSheet, View, Image, Alert, TouchableOpacity, Switch } from 'react-native';
import React, { useEffect } from 'react';
import { hp, wp } from '../../../utils';
import { Text } from '../../../components/Themed';
import Header from '../../../components/Header';
import MIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useIsFocused } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';

const NotificationElement = ({ title, icon, value, onPress }: any) => {
	return (
		<>
			<TouchableOpacity onPress={onPress} style={styles.backgroundView}>
				<View style={styles.rowView}>
					<View style={styles.iconView}>
						<MIcons name={icon} size={20} />
					</View>
					<Text style={styles.titleText}>{title}</Text>
				</View>
				<Text style={styles.titleText}>
					<Switch value={value} />
				</Text>
			</TouchableOpacity>
			<View style={styles.divider} />
		</>
	);
};

export default function NotificationScreen(props: any) {
	const focused = useIsFocused();
	useEffect(() => {
		(async () => {
			// if permission for notification is not granted, request it again
			const { status } = await Notifications.getPermissionsAsync();
			if (status !== 'granted') {
				await Notifications.requestPermissionsAsync();
				console.log('Permission not granted');
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
				<ScrollView style={styles.innerContainer} showsVerticalScrollIndicator={false}>
					<Text style={styles.textTitle}>Notifications</Text>

					<View style={styles.mainContainer}>
						<NotificationElement
							title="New Booking"
							icon="calendar-blank-outline"
							value={true}
						/>
						<View style={styles.backgroundView}>
							<View style={styles.rowView}>
								<View style={styles.iconView}>
									<MIcons name="bank-check" size={20} />
								</View>
								<Text style={styles.titleText}>Client Payment</Text>
							</View>
							<Text style={styles.titleText}>
								<Switch value={true} />
							</Text>
						</View>

						<View style={styles.divider} />

						<View style={styles.backgroundView}>
							<View style={styles.rowView}>
								<View style={styles.iconView}>
									<MIcons name="email-outline" size={20} />
								</View>
								<Text style={styles.titleText}>Email</Text>
							</View>
							<Text style={styles.titleText}>sdfdsf</Text>
						</View>

						<View style={styles.divider} />

						<View style={styles.backgroundView}>
							<View style={styles.rowView}>
								<View style={styles.iconView}>
									<MIcons name="flag-outline" size={20} />
								</View>
								<Text style={styles.titleText}>Role</Text>
							</View>
							<Text style={styles.titleText}>sdfdsfs</Text>
						</View>

						<View style={styles.divider} />

						<View style={styles.backgroundView}>
							<View style={styles.rowView}>
								<View style={styles.iconView}>
									<MIcons name="calendar-blank-outline" size={20} />
								</View>
								<Text style={styles.titleText}>Created</Text>
							</View>
							<Text style={styles.titleText}>dfsd</Text>
						</View>

						<View style={styles.divider} />

						<View style={styles.backgroundView}>
							<View style={styles.rowView}>
								<View style={styles.iconView}>
									<MIcons name="currency-usd" size={20} />
								</View>
								<Text style={styles.titleText}>Currency</Text>
							</View>
							<TouchableOpacity
								style={{ flexDirection: 'row' }}
								onPress={() => props?.navigation?.navigate('ChangeCurrency')}
							>
								<Text style={styles.titleText}>sdfdsf</Text>
								<View style={styles.iconsView}>
									<MIcons name="chevron-right" size={20} />
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
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
		marginVertical: hp(2),
	},
	rowView: {
		flexDirection: 'row',
		backgroundColor: '#F9F9F9',
	},
});
