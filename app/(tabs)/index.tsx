import { StyleSheet } from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View, Button } from '../../components/Themed';
import { Link, useNavigation } from 'expo-router';

export default function HomeScreen() {
	const navigation: any = useNavigation();
	return (
		<View style={styles.container}>
			<Button title="Make new Sale" onPress={() => navigation.push('Sale')} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
	},
	link: {
		marginTop: 15,
		paddingVertical: 15,
	},
	linkText: {
		fontSize: 14,
		color: '#2e78b7',
	},
});
