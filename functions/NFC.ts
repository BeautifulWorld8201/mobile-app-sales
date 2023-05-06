import NfcManager, {NfcTech} from 'react-native-nfc-manager';

export async function writeGoogleLinkOnNFC(place_id: string) {
    const reviewLink = `https://search.google.com/local/writereview?placeid=${place_id}`;

    // try {
	// 	// register for the NFC tag with NDEF in it
	// 	await NfcManager.requestTechnology(NfcTech.Ndef);
	// 	// the resolved tag object will contain `ndefMessage` property
	// 	const tag = await NfcManager.getTag();
	// 	console.warn('Tag found', tag);
	// } catch (ex) {
	// 	console.warn('Oops!', ex);
	// } finally {
	// 	// stop the nfc scanning
	// 	NfcManager.cancelTechnologyRequest();
	// }
}
