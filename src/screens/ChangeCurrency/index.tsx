import { StyleSheet, View, Image, Alert } from 'react-native';
import React, { useEffect } from 'react';
import { hp, wp } from '../../../utils';
import Button from '../../../components/Button';
import Text from '../../../components/Text';
import Header from '../../../components/Header';
import {
	useGetPayoutMethodQuery,
	useDeletePayoutMethodMutation,
	useGetCurrentUserQuery,
	useUpdateUserCurrencyMutation,
} from '../../../redux/user/userApiSlice';
import { tintColorDark } from '../../../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-root-toast';
import { useIsFocused } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const currencies = [
	{
		name: 'USD',
		icon: 'currency-usd',
	},
	{
		name: 'EUR',
		icon: 'currency-eur',
	},
];

export default function UserPayouts(props: any) {
	// use mutation to update user currency
	const [updateCurrency, { isLoading }] = useUpdateUserCurrencyMutation();
	const { data: currentUser, refetch: refetchUser } = useGetCurrentUserQuery();
	function handleCurrencyChange(newCurrency: string) {
		

		Alert.alert('Change Currency', `Are you sure you want to change your currency to ${newCurrency}?`, [
			{
				text: 'Cancel',
				style: 'cancel',
			},
			{
				text: 'Yes',
				onPress: async() => {

					// update user currency
					const newUser = await updateCurrency({ currency: newCurrency });
					refetchUser();

					Toast.show('Currency changed successfully', {
						duration: Toast.durations.LONG,
						position: Toast.positions.BOTTOM,
						shadow: true,
						animation: true,
						hideOnPress: true,
						delay: 0,
					});
					props?.navigation.navigate('Settings');
				},
			},
		]);
	}

	return (
		<>
			<View style={styles.container}>
				<Header title={'Change Currency'} leftButton={() => props.navigation.goBack()} />
				<View style={styles.innerContainer}>
					<View style={styles.mainContainer}>
						{currencies.map((currency, index) => {
							return (
								<View key={index}>
									<TouchableOpacity
										style={{
											flexDirection: 'row',
											alignItems: 'center',
											gap: 12,
											paddingVertical: 24,
										}}
										onPress={() => handleCurrencyChange(currency.name)}
									>
										<MaterialCommunityIcons name={currency.icon} size={20} />
										<Text style={styles.credsFont}>{currency.name}</Text>
									</TouchableOpacity>
									{index !== currencies.length - 1 && (
										<View
											style={{
												height: 1,
												backgroundColor: '#E5E5E5',
												marginHorizontal: 12,
											}}
										/>
									)}
								</View>
							);
						})}
					</View>
				</View>
			</View>
			{/* <View style={styles.buttonContainer}>
     <Button
          style={styles.button}
          onPress={() => {
            Alert.alert('Delete payout method', '', [
              {
                text: 'Cancel',
                onPress: () =>
                  console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'Yes',
                onPress: () => deletePayout(),
              },
            ])
          }}
        >
          <Text style={styles.buttonText}>Delete payout method</Text>
        </Button> 
      </View> */}
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	innerContainer: {
		marginHorizontal: hp(2.5),
		marginTop: hp(2),
	},
	credsFont: {
		fontWeight: '700',
		fontSize: hp(2),
		color: 'black',
	},
	button: {
		backgroundColor: '#d40101',
		borderRadius: hp(5),
		height: hp(7),
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		// marginTop: hp(3),
		marginBottom: hp(3),
	},
	buttonText: {
		color: 'white',
		fontSize: hp(2),
		fontWeight: '700',
	},
	buttonContainer: {
		alignItems: 'center',
		backgroundColor: 'white',
		// marginBottom: hp(3),
		paddingHorizontal: hp(2.5),
	},
	divider: {
		height: wp(0.2),
		width: '100%',
		backgroundColor: '#DEDEDE',
		marginVertical: hp(2),
	},
	bankIcon: {
		height: wp(10),
		width: wp(10),
		alignSelf: 'center',
		marginRight: hp(1),
	},
	mainContainer: {
		backgroundColor: '#F9F9F9',
		borderRadius: 20,
		padding: hp(2),
		width: wp(90),
	},
});
