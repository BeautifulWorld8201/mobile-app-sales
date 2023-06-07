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
	if (country.region == 'Europe') return 'EUR';
	return 'USD';
};

export function shortenString(str: string, maxLength: number = 22): string {
	if (!str) return str;
	if (str.length <= maxLength) {
		return str;
	}

	return str.substring(0, maxLength) + '...';
}
