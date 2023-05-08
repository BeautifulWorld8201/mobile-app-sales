import React, { useState, useEffect } from "react";
import { StyleSheet, TextInput, ToastAndroid } from "react-native";
import NfcManager, { Ndef, NfcTech } from "react-native-nfc-manager";

import EditScreenInfo from "../components/EditScreenInfo";
import { Button, Text, View } from "../components/Themed";
import { writeGoogleLinkOnNFC } from "../functions/NFC";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { MAPS_API_KEY } from "@env";
NfcManager.start();

export default function Sale(): JSX.Element {
  const [location, setLocation] = useState<{
    name: string | undefined;
    place_id: string | undefined;
  }>({ name: undefined, place_id: undefined });

  useEffect(() => {
    return () => {
      NfcManager.cancelTechnologyRequest();
    };
  }, []);

  async function writeGoogleLinkOnNFC(place_id: string) {
    ToastAndroid.show("Please tap card to write.", ToastAndroid.SHORT);
    const reviewLink = `https://search.google.com/local/writereview?placeid=${place_id}`;

    let result = false;

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const bytes = Ndef.encodeMessage([Ndef.textRecord(reviewLink)]);
      if (bytes) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes);
        result = true;
      }
      ToastAndroid.show("Data written successfully", ToastAndroid.SHORT);
    } catch (ex) {
      ToastAndroid.show("An error occured", ToastAndroid.SHORT);
      console.warn(ex);
    } finally {
      NfcManager.cancelTechnologyRequest();
    }

    return result;
  }

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
          language: "en",
        }}
      />
      <Button
        title={`Configure NFC card${
          location.name ? ` for ${location.name}` : ""
        }`}
        disabled={!location.name && !location.place_id}
        onPress={() => {
          if (!location.place_id) return;
          writeGoogleLinkOnNFC(location?.place_id);
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
    color: "#5d5d5d",
    fontSize: 16,
    fontStyle: "italic"
  },
  predefinedPlacesDescription: {
    color: "#1faadb",
  },
  textInputContainer: {
    border: "1px solid red",
  },
};
