import React, { useState, useEffect, useRef } from "react";
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  TextInput,
  ToastAndroid,
  Image,
  TouchableOpacity,
} from "react-native";
import NfcManager, { Ndef, NfcTech } from "react-native-nfc-manager";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

import { Button, Text, View } from "../../../components/Themed";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { MAPS_API_KEY } from "@env";
import Input from "../../../components/Input";

import RBSheet from "react-native-raw-bottom-sheet";
import MyButton from "../../../components/Button";
import Header from "../../../components/Header";
import { hp, wp } from "../../../utils";
import { Formik, useFormik } from "formik";
import * as yup from "yup";
import { tintColorDark } from "../../../constants/Colors";
import { useCreateSaleMutation } from "../../../redux/sale/saleApiSlice";
import { CountryPicker } from "react-native-country-codes-picker";
import { setSelectedCards } from "../../../redux/sale/saleSlice";
import { useDispatch } from "react-redux";
// NfcManager.start();
export default function Sale(props: any): JSX.Element {
  const RBSheetRef = useRef();
  const _formik = useRef();
  const dispatch = useDispatch();
  const [createSale, { isLoading }] = useCreateSaleMutation();
  const [isScanned, setIsScanned] = useState(false);
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const [countryFlag, setCountryFlag] = useState("");
  const [location, setLocation] = useState<{
    name: string | undefined;
    place_id: string | undefined;
  }>({ name: undefined, place_id: undefined });

  const validationSchema = yup.object().shape({
    email: yup
      .string("Required")
      .required("Required")
      .email("Please enter a valid email address"),
    phone: yup.string("Required").required("Required"),
    cards_amount: yup.number().required("Required"),
    place_id: yup.string("Required").required("Required"),
  });
  // useEffect(() => {
  //   return () => {
  //     NfcManager.cancelTechnologyRequest();
  //   };
  // }, []);

  // async function writeGoogleLinkOnNFC(place_id: string) {
  //   if (Platform.OS === "android") {
  //     setTimeout(() => {
  //       RBSheetRef?.current?.open();
  //     }, 500);
  //   }

  //   const reviewLink = `https://search.google.com/local/writereview?placeid=${place_id}`;

  //   let result = false;

  //   try {
  //     await NfcManager.requestTechnology(NfcTech.Ndef);
  //     const bytes = Ndef.encodeMessage([Ndef.uriRecord(reviewLink)]);
  //     if (bytes) {
  //       if (Platform.OS === "android") {
  //         RBSheetRef?.current?.close();
  //       }
  //       await NfcManager.ndefHandler.writeNdefMessage(bytes);
  //       result = true;
  //       if (Platform.OS === "android") {
  //         setIsScanned(true);
  //         setTimeout(() => {
  //           RBSheetRef?.current?.open();
  //         }, 1000);
  //       }
  //     }
  //   } catch (ex) {
  //     console.log(JSON.stringify(ex));
  //   } finally {
  //     NfcManager.cancelTechnologyRequest();
  //   }

  //   return result;
  // }

  const createSaleApi = async (values: any) => {
    let obj = {
      ...values,
      business_name: location?.name,
      phone: countryCode + values["phone"],
    };

    let arr = [];
    try {
      const resp = await createSale(obj);
      resp.data?.links?.links.map((item) => {
        arr.push({
          link: item,
          checked: false,
        });
      });

      dispatch(setSelectedCards(arr));
      if (resp?.data) {
        props.navigation.navigate("TakePayment");
      }
    } catch (error) {
      console.log("error---in sale->", error);
    }
  };
  return (
    <View style={styles.container}>
      <Header title={"Sale"} leftButton={() => props.navigation.goBack()} />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        {/* for some reason the GoogleMapsInput doesn't work when inside a <View /> */}
        <View style={styles.innerContainer}>
          <Formik
            innerRef={_formik}
            validationSchema={validationSchema}
            initialValues={{
              email: "",
              phone: "",
              cards_amount: "",
              place_id: "",
            }}
            onSubmit={(values) => createSaleApi(values)}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <>
                <Input
                  onChangeText={(text) =>
                    handleChange("email")(text.replace(/\s/g, ""))
                  }
                  onBlur={handleBlur("email")}
                  value={values.email}
                  style={styles.inputField}
                  icon
                  iconName="email"
                  inputViewStyle={styles.inputViewStyle}
                  iconColor={"#ccc"}
                  autoCapitalize={"none"}
                  placeholder={"Email address of business"}
                />
                {errors.email && touched.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
                <TouchableOpacity
                  style={styles.inputViewStyle}
                  onPress={() => setShow(true)}
                >
                  {countryCode && (
                    <Text style={{ width: "20%", marginLeft: 10 }}>
                      {countryFlag + " " + countryCode}
                    </Text>
                  )}
                  <Input
                    onChangeText={handleChange("phone")}
                    onBlur={handleBlur("phone")}
                    value={values.phone}
                    style={{
                      ...styles.inputField,

                      width: countryCode ? "95%" : "90%",
                    }}
                    icon
                    iconColor={tintColorDark}
                    iconName="phone"
                    inputViewStyle={{
                      ...styles.inputViewStyle,

                      marginTop: 10,
                      width: countryCode ? "70%" : "100%",
                    }}
                    autoCapitalize={"none"}
                    placeholder={"Phone number of business"}
                    keyboardType="number-pad"
                  />
                </TouchableOpacity>
                {errors.phone && touched.phone && (
                  <Text style={styles.errorText}>{errors.phone}</Text>
                )}
                {/* <Input
                  onChangeText={handleChange("cards_amount")}
                  onBlur={handleBlur("cards_amount")}
                  value={values.cards_amount}
                  style={styles.inputField}
                  icon
                  iconName="cards"
                  iconColor={"#ccc"}
                  autoCapitalize={"none"}
                  inputViewStyle={styles.inputViewStyle}
                  placeholder={"Enter amount of cards"}
                /> */}
                <View style={styles.cardInputView}>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                      if (
                        values.cards_amount == "" ||
                        values.cards_amount == 1
                      ) {
                        _formik.current.setFieldValue("cards_amount", 0);
                      } else {
                        _formik.current.setFieldValue(
                          "cards_amount",
                          parseInt(values.cards_amount) - 1
                        );
                      }
                    }}
                  >
                    <Icon name={"minus"} color={"white"} size={20} />
                  </TouchableOpacity>

                  <TextInput
                    onChangeText={handleChange("cards_amount")}
                    onBlur={handleBlur("cards_amount")}
                    value={values.cards_amount.toString()}
                    keyboardType="number-pad"
                    placeholder={"Amount of cards"}
                    style={styles.cardInput}
                  />
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                      if (values.cards_amount == "") {
                        _formik.current.setFieldValue("cards_amount", 1);
                      } else {
                        _formik.current.setFieldValue(
                          "cards_amount",
                          parseInt(values.cards_amount) + 1
                        );
                      }
                    }}
                  >
                    <Icon name={"plus"} color={"white"} size={20} />
                  </TouchableOpacity>
                </View>
                {errors.cards_amount && touched.cards_amount && (
                  <Text style={styles.errorText}>{errors.cards_amount}</Text>
                )}
                <GooglePlacesAutocomplete
                  styles={googleInputStyles}
                  placeholder="Search for business"
                  onPress={(data, details = null) => {
                    setLocation({
                      name: data.structured_formatting.main_text,
                      place_id: data.place_id,
                    });
                    handleChange("place_id")(data.place_id);
                  }}
                  query={{
                    key: "AIzaSyAijbifioHwNKlvdAyBirgqdR82-Xiy84I",
                    language: "en",
                  }}
                  textInputProps={{
                    handleBlur: handleBlur("place_id"),
                    value: location?.name,
                  }}
                />
                {errors.place_id && touched.place_id && (
                  <Text style={styles.errorText}>{errors.place_id}</Text>
                )}
              </>
            )}
          </Formik>
        </View>

        {/* <Button
          title={`Configure NFC card${
            location.name ? ` for ${location.name}` : ""
          }`}
          disabled={!location.name && !location.place_id}
          onPress={() => {
            if (!location.place_id) return;

            writeGoogleLinkOnNFC(location?.place_id);
          }}
        /> */}
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
            <Text style={styles.buttonText}>
              {isScanned ? "Done" : "Cancel"}
            </Text>
          </MyButton>
        </RBSheet>
        <CountryPicker
          show={show}
          style={{
            modal: {
              height: 500,
            },
          }}
          pickerButtonOnPress={(item) => {
            console.log("item here", item);
            setCountryCode(item.dial_code);
            setCountryFlag(item.flag);
            setShow(false);
          }}
        />
      </KeyboardAwareScrollView>
      <View style={styles.buttonContainer}>
        <MyButton
          style={styles.buttonBelow}
          onPress={() => _formik.current.handleSubmit()}
          isLoading={isLoading}
          disabled={isLoading}
          loaderColor={styles.loaderColor}
        >
          <Text style={styles.buttonText}>
            {`Create Sale${location.name ? ` for ${location.name}` : ""}`}
          </Text>
        </MyButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
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
  innerContainer: {
    marginHorizontal: hp(2.5),
    marginTop: hp(2),
  },
  inputField: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    marginVertical: 6,
    height: hp(6),

    width: "90%",
    color: "black",
  },
  inputViewStyle: {
    flexDirection: "row",
    width: "100%",

    height: hp(6),
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    marginBottom: hp(1),
  },
  buttonBelow: {
    backgroundColor: tintColorDark,
    borderRadius: hp(5),
    height: hp(7),
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(3),
    // paddingHorizontal: hp(2.5),
  },

  buttonContainer: {
    alignItems: "center",
    // bottom: 0,
    backgroundColor: "white",
    paddingHorizontal: hp(2.5),
  },
  loaderColor: {
    color: "white",
  },
  errorText: {
    fontSize: 14,
    color: "red",
    marginBottom: hp(1),
  },
  addButton: {
    height: hp(5),
    width: "20%",
    backgroundColor: tintColorDark,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardInputView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(1),
  },
  cardInput: {
    height: hp(5),
    width: "50%",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    padding: 10,
    textAlign: "center",
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
  textInputContainer: {},
};
