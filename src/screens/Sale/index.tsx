import React, { useState, useEffect, useRef } from "react";
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  TextInput,
  ToastAndroid,
  Image,
} from "react-native";
import NfcManager, { Ndef, NfcTech } from "react-native-nfc-manager";

import { Button, Text, View } from "../../../components/Themed";

import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { MAPS_API_KEY } from "@env";
import RBSheet from "react-native-raw-bottom-sheet";
import MyButton from "../../../components/Button";
import { hp, wp } from "../../../utils";
NfcManager.start();
export default function Sale(): JSX.Element {
  const RBSheetRef = useRef();
  const [isScanned, setIsScanned] = useState(false);
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
    if (Platform.OS === "android") {
      setTimeout(() => {
        RBSheetRef?.current?.open();
      }, 500);
    }

    const reviewLink = `https://search.google.com/local/writereview?placeid=${place_id}`;

    let result = false;

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const bytes = Ndef.encodeMessage([Ndef.uriRecord(reviewLink)]);
      if (bytes) {
        if (Platform.OS === "android") {
          RBSheetRef?.current?.close();
        }
        await NfcManager.ndefHandler.writeNdefMessage(bytes);
        result = true;
        if (Platform.OS === "android") {
          setIsScanned(true);
          setTimeout(() => {
            RBSheetRef?.current?.open();
          }, 1000);
        }
      }
    } catch (ex) {
      console.log(JSON.stringify(ex));
    } finally {
      NfcManager.cancelTechnologyRequest();
    }

    return result;
  }

  // useEffect(() => {
  //   // isSupported();
  // }, []);

  const isSupported = async () => {
    try {
      const test = await NfcManager.isSupported();
      // console.log("test---->", test);s
    } catch (e) {
      console.log(e);
    }
  };
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
      <RBSheet
        ref={RBSheetRef}
        // height={hp(30)}
        height={hp(37)}
        openDuration={250}
        customStyles={{
          container: {
            borderTopLeftRadius: hp(5),
            borderTopRightRadius: hp(5),
            padding: hp(3),
            backgroundColor: "#fff",
            alignItems: "center",
            // justifyContent: "center",
          },
        }}
      >
        <Text style={{ fontSize: hp(2.75), color: "#ccc" }}>
          {isScanned ? "Scan Complete" : "Ready to Scan"}
        </Text>
        <Image
          source={
            isScanned
              ? require("../../../assets/images/blueCheck.png")
              : require("../../../assets/images/nfc-tag.png")
          }
          style={{
            height: 150,
            width: 150,
            marginTop: hp(2),
          }}
          resizeMode="contain"
        />

        <MyButton
          style={styles.button}
          onPress={() => {
            RBSheetRef.current.close();
          }}
        >
          <Text style={styles.buttonText}>{isScanned ? "Done" : "Cancel"}</Text>
        </MyButton>
      </RBSheet>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#1faadb",
    borderRadius: hp(5),
    height: hp(5),
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(2),
  },
  buttonText: {
    color: "white",
    fontSize: hp(2),
  },
});

const googleInputStyles = {
  container: {
    flex: 0,
    marginTop: 50,
  },
  textInput: {
    height: 38,
    color: "#5d5d5d",
    fontSize: 16,
    fontStyle: "italic",
  },
  predefinedPlacesDescription: {
    color: "#1faadb",
  },
  textInputContainer: {
    border: "1px solid red",
  },

  // bottomSheetContainerStyle:
};
