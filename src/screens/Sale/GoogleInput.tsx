import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { hp } from '../../../utils';
import { Text } from '../../../components/Themed';
import { StyleSheet } from 'react-native';

const GoogleInput = ({
	handleBlur,
	setLocation,
	handleChange,
	errors,
	touched,
}: {
	handleBlur: (name: string) => void;
	setLocation: any;
	handleChange: any;
	errors: any;
	touched: any;
}) => {
	return (
		<>
			<GooglePlacesAutocomplete
				styles={googleInputStyles}
				placeholder="Search for business"
				onPress={(data, details = null) => {
					setLocation({
						name: data.structured_formatting.main_text,
						place_id: data.place_id,
					});
					handleChange('place_id')(data.place_id);
				}}
				autoFillOnNotFound={true}
				query={{
					key: 'AIzaSyAijbifioHwNKlvdAyBirgqdR82-Xiy84I',
					language: 'en',
				}}
				textInputProps={{
					handleBlur: handleBlur('place_id'),
				}}
			/>
			{errors.place_id && touched.place_id && (
				<Text style={styles.errorText}>{errors.place_id}</Text>
			)}
		</>
	);
};

export default GoogleInput;

const styles = StyleSheet.create({
	errorText: {
		fontSize: 14,
		color: 'red',
		marginBottom: hp(1),
	},
});

const googleInputStyles = {
	container: {
		// marginHorizontal: hp(2.5),
	},
	textInput: {
		height: hp(6),
		color: '#5d5d5d',
		fontSize: 14,
		backgroundColor: '#f9f9f9',
		// fontStyle: "italic",
		borderRadius: 10,
	},
	predefinedPlacesDescription: {
		color: '#1faadb',
	},
};
