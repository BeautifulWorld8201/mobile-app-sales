import {StyleSheet } from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View, Button } from '../../components/Themed';

export default function TabOneScreen() {
	return <View style={styles.container}>
    {/* add a Button that will say "Make new Sale" and that will trigger going to another page */}
    <Button title="Make new Sale" onPress={() => {
      // go to a new page 
      
    }} />
  </View>;
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
});
