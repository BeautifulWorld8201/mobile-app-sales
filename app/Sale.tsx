import { StyleSheet, TextInput } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Button, Text, View } from '../components/Themed';
import { useState } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { MAPS_API_KEY } from '@env';

export default function Sale() {
	const [location, setLocation] = useState<{
		name: string | undefined;
		place_id: string | undefined;
	}>({ name: undefined, place_id: undefined });
	return (
		<>
			{/* for some reason the GoogleMapsInput doesn't work when inside a <View /> */}

			<GooglePlacesAutocomplete
				styles={googleInputStyles}
				placeholder="Example: Lotte Supermarket, New York"
				onPress={(data, details = null) => {
					setLocation({
						name: data.structured_formatting.main_text,
						place_id: data.place_id,
					});
				}}
				query={{
					key: MAPS_API_KEY,
					language: 'en',
				}}
			/>
			<Button
				title={`Configure NFC card${location.name ? ` for ${location.name}` : ''}`}
				disabled={!location.name && !location.place_id}
				onPress={() => {
					if (!location.place_id) return;
					
				}}
			/>
		</>
	);
}

const styles = StyleSheet.create({});

const googleInputStyles = {
	container: {
		flex: 0,
	},
	textInput: {
		height: 38,
		color: '#5d5d5d',
		fontSize: 16,
		textStyle: 'italic',
		border: '1px solid red',
	},
	predefinedPlacesDescription: {
		color: '#1faadb',
	},
	textInputContainer: {
		border: '1px solid red',
	},
};
