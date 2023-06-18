import React from 'react';
import { tintColorDark } from '../constants/Colors';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const Loader = () => {
	return (
		<View style={styles.indicator}>
			<ActivityIndicator size="large" color={tintColorDark} />
		</View>
	);
};

export default Loader;

const styles = StyleSheet.create({
    indicator: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});