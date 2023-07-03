import pricing from '../../constants/pricing';

export const getCurrencySymbol = (currency: string): string => {
	switch (currency) {
		case 'USD':
			return '$';
		case 'EUR':
			return '€';
		case 'AED':
			return 'AED ';
		default:
			return currency;
	}
};

export const getPrice = (amount: number, currency: string): number => {
	if (!pricing[amount]) return 0;
	return pricing[amount][currency].price;
};

export const getCurrencyByCountry = (country: {
	cca2: string;
	currency: [string];
	flag: string;
	name: string;
	region: string;
	subregion: string;
}) => {
	if (country.name == 'United Arab Emirates') return 'AED';
	if (country.name == 'Morocco') return 'MAD';
	if (country.region == 'Europe') return 'EUR';
	return 'USD';
};

export function getFlagEmoji(countryCode: string): string {
	if (!countryCode) return countryCode;
	const codePoints = countryCode
		.toUpperCase()
		.split('')
		.map((char) => 127397 + char.charCodeAt(0));
	return String.fromCodePoint(...codePoints);
}

// create a function that will display a big number with K
// if the number is bigger than 1000
export const formatNumber = (number: number): string => {
	if (number > 1000) {
		return (number / 1000).toFixed(1) + 'k';
	}
	return number.toString();
};

export function shortenString(str: string, maxLength: number = 22): string {
	if (!str) return str;
	if (str.length <= maxLength) {
		return str;
	}

	return str.substring(0, maxLength) + '...';
}

export function shortenStringMiddle(str: string, maxLength: number = 10): string {
	// shorten string from the middle
	if (!str) return str;
	if (str.length <= maxLength) {
		return str;
	}

	const mid = Math.floor(maxLength / 2);
	return str.substring(0, mid) + '...' + str.substring(str.length - mid, str.length);


}
