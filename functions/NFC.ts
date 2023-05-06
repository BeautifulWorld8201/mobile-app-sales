export function writeGoogleLinkOnNFC(place_id: string) {
    const reviewLink = `https://search.google.com/local/writereview?placeid=${place_id}`;
    console.log(reviewLink);
}
