import { ScrollView, StyleSheet, TouchableOpacity, Linking, Share, Platform, Alert } from 'react-native';

import MIcons from '@expo/vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../../components/Header';
import { Text, View } from '../../../components/Themed';
import { useLogoutUserMutation } from '../../../redux/auth/authApiSlice';
import { logOut } from '../../../redux/auth/authSlice';
import { hp, wp } from '../../../utils';

export default function Settings(props: any) {
	const dispatch = useDispatch();
	const refreshToken = useSelector((state) => state?.auth?.refreshToken?.token);
	const user = useSelector((state) => state?.auth?.loginUser);

	const [logoutUser, { isLoading }] = useLogoutUserMutation();
	const logoutApi = async () => {
		const data = {
			refreshToken,
		};
		try {
			const resp = await logoutUser(data);

			dispatch(logOut());
		} catch (error) {
			console.log('---error--logout-', error);
		}
	};
	return (
		<View style={styles.container}>
			<Header title={'Settings'} />

			<ScrollView style={styles.innerContainer}>
				<Text style={styles.textTitle}>Account</Text>

				<View style={styles.mainContainer}>
					<View style={styles.backgroundView}>
						<View style={styles.rowView}>
							<View style={styles.iconView}>
								<MIcons name="account-outline" size={20} />
							</View>
							<Text style={styles.titleText}>Name</Text>
						</View>
						<Text style={styles.titleText}>{user?.username}</Text>
					</View>

					<View style={styles.divider} />

					<View style={styles.backgroundView}>
						<View style={styles.rowView}>
							<View style={styles.iconView}>
								<MIcons name="email-outline" size={20} />
							</View>
							<Text style={styles.titleText}>Email</Text>
						</View>
						<Text style={styles.titleText}>{user?.email}</Text>
					</View>

					<View style={styles.divider} />

					<View style={styles.backgroundView}>
						<View style={styles.rowView}>
							<View style={styles.iconView}>
								<MIcons name="flag-outline" size={20} />
							</View>
							<Text style={styles.titleText}>Role</Text>
						</View>
						<Text style={styles.titleText}>{user?.role}</Text>
					</View>

					<View style={styles.divider} />

					<View style={styles.backgroundView}>
						<View style={styles.rowView}>
							<View style={styles.iconView}>
								<MIcons name="calendar-blank-outline" size={20} />
							</View>
							<Text style={styles.titleText}>Created</Text>
						</View>
						<Text style={styles.titleText}>
							{moment(user?.createdAt).format('MMMM Do YYYY')}
						</Text>
					</View>
				</View>
				<Text style={styles.textTitle}>Settings</Text>

				<View style={styles.mainContainer}>
					<TouchableOpacity style={styles.backgroundView}>
						<View style={styles.rowView}>
							<View style={styles.iconView}>
								<MIcons name="wallet-outline" size={20} />
							</View>
							<Text style={styles.titleText}>Payouts</Text>
						</View>
						<View style={styles.iconsView}>
							<MIcons name="chevron-right" size={20} />
						</View>
					</TouchableOpacity>

					<View style={styles.divider} />

					<TouchableOpacity style={styles.backgroundView}>
						<View style={styles.rowView}>
							<View style={styles.iconView}>
								<MIcons name="bell-outline" size={20} />
							</View>
							<Text style={styles.titleText}>Notifications</Text>
						</View>
						<View style={styles.iconsView}>
							<MIcons name="chevron-right" size={20} />
						</View>
					</TouchableOpacity>
				</View>
				<Text style={styles.textTitle}>Miscellaneous</Text>

				<View style={styles.mainContainer}>
					<TouchableOpacity
						onPress={() => {
							Share.share({
								message: 'Become a verified Popcard seller today!',
								url:
									Platform.OS != 'ios'
										? 'market://details?id=${GOOGLE_PACKAGE_NAME}'
										: 'https://apps.apple.com/be/app/popcard-salesmen/id6448954487',
							}).catch((e) => Alert.alert(e))
						}}
						style={styles.backgroundView}
					>
						<View style={styles.rowView}>
							<View style={styles.iconView}>
								<MIcons name={Platform.OS == 'ios' ? "share-variant-outline" : "share-variant-outline"} size={20} />
							</View>
							<Text style={styles.titleText}>Share Popcard Salesmen</Text>
						</View>
						<View style={styles.iconsView}>
							<MIcons name="chevron-right" size={20} />
						</View>
					</TouchableOpacity>

					<View style={styles.divider} />

					<TouchableOpacity
						onPress={() => {
							if (Platform.OS != 'ios') {
								//To open the Google Play Store
								Linking.openURL(`market://details?id={GOOGLE_PACKAGE_NAME}`).catch(
									(err) => alert('Google Play Store not found')
								);
							} else {
								//To open the Apple App Store
								Linking.openURL(
									`itms-apps://itunes.apple.com/us/app/apple-store/id6448954487?mt=8`
								).catch((err) => alert('App store not found'));
							}
						}}
						style={styles.backgroundView}
					>
						<View style={styles.rowView}>
							<View style={styles.iconView}>
								<MIcons name="star-outline" size={20} />
							</View>
							<Text style={styles.titleText}>Rate Popcard Salesmen</Text>
						</View>
						<View style={styles.iconsView}>
							<MIcons name="chevron-right" size={20} />
						</View>
					</TouchableOpacity>

					<View style={styles.divider} />

					<TouchableOpacity
						onPress={() => {
							Linking.openURL(`mailto:contact@popcard.io`);
						}}
						style={styles.backgroundView}
					>
						<View style={styles.rowView}>
							<View style={styles.iconView}>
								<MIcons name="phone-outline" size={20} />
							</View>
							<Text style={styles.titleText}>Contact Us</Text>
						</View>
						<View style={styles.iconsView}>
							<MIcons name="chevron-right" size={20} />
						</View>
					</TouchableOpacity>
				</View>
				<TouchableOpacity onPress={() => logoutApi()} style={styles.logoutView}>
					<Text style={styles.logoutText}>Log Out</Text>
				</TouchableOpacity>
			</ScrollView>

			{/* <Text style={styles.title}>SETTINGS</Text>
      <Text>
        Connected as: {user?.username} [{user?.email}]
      </Text>
      <Button title="Logout" onPress={() => logoutApi()} /> */}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// alignItems: "center",
		// justifyContent: "center",
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
    fontWeight: '600'
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
