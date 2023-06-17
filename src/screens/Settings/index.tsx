import {
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	Linking,
	Share,
	Platform,
	Alert,
	FlatList,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';

import MIcons from '@expo/vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../../components/Header';
import { Text, View } from '../../../components/Themed';
import { useLogoutUserMutation } from '../../../redux/auth/authApiSlice';
import { logOut } from '../../../redux/auth/authSlice';
import { hp, wp } from '../../../utils';
import { useGetCurrentUserQuery, useGetPayoutMethodQuery } from '../../../redux/user/userApiSlice';
import { useIsFocused } from '@react-navigation/native';
import { apiSlice } from '../../../redux/api/apiSlice';
import RNModal from 'react-native-modal';
import { useTranslation } from 'react-i18next';
import { tintColorDark, tintColorLight } from '../../../constants/Colors';
import { setLanguage } from '../../../redux/language/languageSlice';

const LangModal: React.FC<{
	ModalRef: React.MutableRefObject<any>;
	changeLang: Function;
	t: Function;
	dispatch: Function;
}> = ({ ModalRef, changeLang, t, dispatch }) => {
	const [visible, setvisible] = useState(false);

	// add your languages here
	const LangList = [
		{ label: 'English', code: 'en' },
		{ label: 'Français', code: 'fr' },
		{ label: 'Nederlands', code: 'nl' },
	];

	if (ModalRef) ModalRef.current = { visible, setvisible };

	const renderItem: React.FC<{ item: { label: String; code: String } }> = ({ item }) => {
		return (
			<TouchableOpacity
				onPress={() => {
					changeLang(item.code);
					dispatch(setLanguage(item.code));
					setvisible(false);
				}}
				style={styles.LangSingle}
			>
				<Text>{item.label}</Text>
			</TouchableOpacity>
		);
	};
	return (
		<RNModal
			isVisible={visible}
			swipeDirection={['down']}
			onSwipeComplete={() => setvisible(false)}
			onBackdropPress={() => setvisible(false)}
			hasBackdrop
			style={{ justifyContent: 'flex-end', margin: 0 }}
		>
			<View style={styles.LangBody}>
				<View style={styles.LangLine} />
				<Text style={styles.LangHeader}>{t('Change Language')}</Text>
				<Text style={styles.titleText}>
					{t('Click on the language you want to change to')}
				</Text>
				<View style={{ marginTop: hp(2) }}>
					<FlatList
						data={LangList}
						renderItem={renderItem}
						keyExtractor={(e, id) => id.toString()}
					/>
				</View>
			</View>
		</RNModal>
	);
};

export default function Settings(props: any) {
	const { t, i18n } = useTranslation();
	const focused = useIsFocused();

	const LangModalRef = useRef<{
		visible: boolean;
		setvisible: React.Dispatch<React.SetStateAction<boolean>>;
	} | null>(null);

	const dispatch = useDispatch();
	const refreshToken = useSelector((state) => state?.auth?.refreshToken?.token);
	const user = useSelector((state) => state?.auth?.loginUser);
	const { data: currentUser, refetch: refetchUser } = useGetCurrentUserQuery();

	const { data: payouts, isError, refetch } = useGetPayoutMethodQuery();

	const [logoutUser, { isLoading }] = useLogoutUserMutation();
	
	const logoutApi = async () => {
		const data = {
			refreshToken,
		};
		try {
			const resp = await logoutUser(data);

			dispatch(logOut());
			dispatch(apiSlice.util.resetApiState());
		} catch (error) {
			console.log('---error--logout-', error);
		}
	};
	return (
		<View style={styles.container}>
			<Header title={t('Settings')} />

			<ScrollView style={styles.innerContainer} showsVerticalScrollIndicator={false}>
				<LangModal
					ModalRef={LangModalRef}
					changeLang={i18n.changeLanguage}
					t={t}
					dispatch={dispatch}
				/>

				<Text style={styles.textTitle}>{t('Account')}</Text>

				<View style={styles.mainContainer}>
					<View style={styles.backgroundView}>
						<View style={styles.rowView}>
							<View style={styles.iconView}>
								<MIcons name="account-outline" size={20} />
							</View>
							<Text style={styles.titleText}>{t('Name')}</Text>
						</View>
						<Text style={styles.titleText}>{user?.username}</Text>
					</View>

					<View style={styles.divider} />

					<View style={styles.backgroundView}>
						<View style={styles.rowView}>
							<View style={styles.iconView}>
								<MIcons name="email-outline" size={20} />
							</View>
							<Text style={styles.titleText}>{t('Email')}</Text>
						</View>
						<Text style={styles.titleText}>{user?.email}</Text>
					</View>

					<View style={styles.divider} />

					<View style={styles.backgroundView}>
						<View style={styles.rowView}>
							<View style={styles.iconView}>
								<MIcons name="flag-outline" size={20} />
							</View>
							<Text style={styles.titleText}>{t('Role')}</Text>
						</View>
						<Text style={styles.titleText}>{user?.role}</Text>
					</View>

					<View style={styles.divider} />

					<View style={styles.backgroundView}>
						<View style={styles.rowView}>
							<View style={styles.iconView}>
								<MIcons name="calendar-blank-outline" size={20} />
							</View>
							<Text style={styles.titleText}>{t('Created')}</Text>
						</View>
						<Text style={styles.titleText}>
							{moment(user?.createdAt).format('MMMM Do YYYY')}
						</Text>
					</View>

					<View style={styles.divider} />

					<View style={styles.backgroundView}>
						<View style={styles.rowView}>
							<View style={styles.iconView}>
								<MIcons name="currency-usd" size={20} />
							</View>
							<Text style={styles.titleText}>{t('Currency')}</Text>
						</View>
						<Text style={styles.titleText}>{currentUser?.currency}</Text>
					</View>
				</View>
				<Text style={styles.textTitle}>{t('Settings')}</Text>

				<View style={styles.mainContainer}>
					<TouchableOpacity
						style={styles.backgroundView}
						onPress={() =>
							payouts
								? props?.navigation?.navigate('UserPayouts')
								: props?.navigation?.navigate('Payouts')
						}
					>
						<View style={styles.rowView}>
							<View style={styles.iconView}>
								<MIcons name="wallet-outline" size={20} />
							</View>
							<Text style={styles.titleText}>{t('Payouts')}</Text>
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
							<Text style={styles.titleText}>{t('Notifications')}</Text>
						</View>
						<View style={styles.iconsView}>
							<MIcons name="chevron-right" size={20} />
						</View>
					</TouchableOpacity>

					<View style={styles.divider} />

					<TouchableOpacity
						style={styles.backgroundView}
						onPress={() => LangModalRef.current?.setvisible(true)}
					>
						<View style={styles.rowView}>
							<View style={styles.iconView}>
								<MIcons name="web" size={20} />
							</View>
							<Text style={styles.titleText}>{t('Language')}</Text>
						</View>
						<View
							style={{
								...styles.iconsView,
								flexDirection: 'row',
								alignItems: 'center',
							}}
						>
							<Text style={{ textTransform: 'uppercase' }}>{i18n.language}</Text>
							<MIcons name="chevron-right" size={20} />
						</View>
					</TouchableOpacity>
				</View>
				<Text style={styles.textTitle}>{t('Miscellaneous')}</Text>

				<View style={styles.mainContainer}>
					<TouchableOpacity
						onPress={() => {
							Share.share({
								message: 'Become a verified Popcard seller today!',
								url:
									Platform.OS != 'ios'
										? 'market://details?id=${GOOGLE_PACKAGE_NAME}'
										: 'https://apps.apple.com/be/app/popcard-salesmen/id6448954487',
							}).catch((e) => Alert.alert(e));
						}}
						style={styles.backgroundView}
					>
						<View style={styles.rowView}>
							<View style={styles.iconView}>
								<MIcons
									name={
										Platform.OS == 'ios'
											? 'share-variant-outline'
											: 'share-variant-outline'
									}
									size={20}
								/>
							</View>
							<Text style={styles.titleText}>{t('Share Popcard Salesmen')}</Text>
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
									(err) => alert(t('Google Play Store not found'))
								);
							} else {
								//To open the Apple App Store
								Linking.openURL(
									`itms-apps://itunes.apple.com/us/app/apple-store/id6448954487?mt=8`
								).catch((err) => alert(t('App store not found')));
							}
						}}
						style={styles.backgroundView}
					>
						<View style={styles.rowView}>
							<View style={styles.iconView}>
								<MIcons name="star-outline" size={20} />
							</View>
							<Text style={styles.titleText}>{t('Rate Popcard Salesmen')}</Text>
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
							<Text style={styles.titleText}>{t('Contact Us')}</Text>
						</View>
						<View style={styles.iconsView}>
							<MIcons name="chevron-right" size={20} />
						</View>
					</TouchableOpacity>
				</View>
				<TouchableOpacity onPress={() => logoutApi()} style={styles.logoutView}>
					<Text style={styles.logoutText}>{t('Log Out')}</Text>
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
	LangBody: {
		backgroundColor: 'white',
		height: hp(40),
		borderTopLeftRadius: 25,
		borderTopRightRadius: 25,
		alignItems: 'center',
		paddingTop: hp(2),
	},
	LangLine: {
		backgroundColor: tintColorLight,
		width: wp(40),
		height: hp(0.8),
		borderRadius: 25,
	},
	LangHeader: {
		paddingTop: hp(2),
		paddingBottom: hp(2),
		fontWeight: 'bold',
		fontSize: 24,
	},
	LangSingle: {
		marginTop: hp(2),
		backgroundColor: tintColorDark,
		width: wp(80),
		height: hp(5),
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
