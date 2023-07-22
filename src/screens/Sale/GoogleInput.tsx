import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { hp } from "../../../utils";
import { Text, View } from "../../../components/Themed";
import { StyleSheet } from "react-native";
import { Icon } from "@rneui/base";

const GoogleInput = ({
  handleBlur,
  locations,
  setLocations,
  handleChange,
  errors,
  touched,
  index,
}: {
  handleBlur: (name: string) => void;
  locations: [{ name: string; place_id: string }];
  setLocations: any;
  handleChange: any;
  errors: any;
  touched: any;
  index: number;
}) => {
  return (
    <>
      {locations[index]?.place_id ? (
        <View style={styles.inputViewStyle}>
          <Text>{locations[index].name}</Text>
          <Icon
            name="close"
            size={20}
            color={"red"}
            onPress={() => {
              setLocations(
                (locations: [{ name: string; place_id: string }]) => {
                  const locationsCopy = [...locations];
                  locationsCopy[index] = {
                    name: "",
                    place_id: "",
                  };
                  return locationsCopy;
                },
              );
            }}
          />
        </View>
      ) : (
        <GooglePlacesAutocomplete
          styles={googleInputStyles}
          placeholder={"Search for business " + (index + 1)}
          onPress={(data, details = null) => {
            setLocations((locations: [{ name: string; place_id: string }]) => {
              const locationsCopy = [...locations];
              locationsCopy[index] = {
                name: data.structured_formatting.main_text,
                place_id: data.place_id,
              };
              return locationsCopy;
            });
          }}
          autoFillOnNotFound={true}
          query={{
            key: "AIzaSyAijbifioHwNKlvdAyBirgqdR82-Xiy84I",
            language: "en",
          }}
        />
      )}
      {errors.place_id && touched.place_id && (
        <Text style={styles.errorText}>{errors.place_id}</Text>
      )}
    </>
  );
};

export default GoogleInput;

const styles = StyleSheet.create({
  errorText: {
    fontSize: 14,
    color: "red",
    marginBottom: hp(1),
  },
  inputViewStyle: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: hp(2.5),
    height: hp(6),
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    marginBottom: hp(1),
    justifyContent: "space-between",
  },
});

const googleInputStyles = {
  container: {
    // marginHorizontal: hp(2.5),
  },
  textInput: {
    height: hp(6),
    color: "#5d5d5d",
    fontSize: 14,
    backgroundColor: "#f9f9f9",
    // fontStyle: "italic",
    borderRadius: 10,
  },
  predefinedPlacesDescription: {
    color: "#1faadb",
  },
};
