import Svg, { LinearGradient, Text, Defs, Stop, TSpan } from 'react-native-svg';

import React from 'react';

const GradientText = ({ children }: { children: string }) => {
	return (
		<Svg viewBox="0 0 300 300" height="300" width="300">
			<Defs>
				<LinearGradient
					id="rainbow"
					x1="0"
					x2="0"
					y1="0"
					y2="100%"
					gradientUnits="userSpaceOnUse"
				>
					<Stop stopColor="#FF5B99" offset="0%" />
					<Stop stopColor="#FF5447" offset="20%" />
					<Stop stopColor="#FF7B21" offset="40%" />
					<Stop stopColor="#EAFC37" offset="60%" />
					<Stop stopColor="#4FCB6B" offset="80%" />
					<Stop stopColor="#51F7FE" offset="100%" />
				</LinearGradient>
			</Defs>
			<Text fill="url(#rainbow)">
                <TSpan fontSize={16}>{children}</TSpan>
            </Text>
		</Svg>
	);
};

export default GradientText;
