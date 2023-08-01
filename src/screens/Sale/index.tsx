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
import googleLogo from "../../../assets/images/google.png";

import { getCallingCode } from "react-native-country-picker-modal";

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
import DropDownPicker from "react-native-dropdown-picker";
import { useGetCurrentUserQuery } from "../../../redux/user/userApiSlice";
import {
  getCurrencySymbol,
  getFlagEmoji,
  getPrice,
  shortenString,
} from "../../helpers/misc";
import { set } from "react-native-reanimated";
import { CheckBox, Switch } from "@rneui/base";
import Toast from "react-native-root-toast";
import GoogleInput from "./GoogleInput";

import { useTranslation } from "react-i18next";
import { scheduleSaleReminderNotification } from "../../../utils/notifications";

// NfcManager.start();
export default function Sale(props: any): JSX.Element {
  const { t } = useTranslation();
  const { data: currentUser } = useGetCurrentUserQuery();

  const RBSheetRef = useRef();
  const _formik = useRef();
  const dispatch = useDispatch();
  const [createSale, { isLoading }] = useCreateSaleMutation();
  const [isScanned, setIsScanned] = useState(false);
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const [countryFlag, setCountryFlag] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [customPrice, setCustomPrice] = useState({ checked: false, value: 0 });
  const [discount, setDiscount] = useState(0);
  const [items, setItems] = useState([
    {
      label: "1 Google Popcard",
      value: 1,
      icon: () => (
        <Image
          source={require("../../../assets/cards/card-1.jpeg")}
          style={{ height: 50, width: 50 }}
        />
      ),
    },
    {
      label: "3 Google Popcards",
      value: 3,
      icon: () => (
        <Image
          source={require("../../../assets/cards/card-3.jpeg")}
          style={{ height: 50, width: 50 }}
        />
      ),
    },
    {
      label: "5 Google Popcards",
      value: 5,
      icon: () => (
        <Image
          source={require("../../../assets/cards/card-5.jpeg")}
          style={{ height: 50, width: 50 }}
        />
      ),
    },
    {
      label: "10 Google Popcards",
      value: 10,
      icon: () => (
        <Image
          source={require("../../../assets/cards/card-10.jpeg")}
          style={{ height: 50, width: 50 }}
        />
      ),
    },
  ]);
  const [locations, setLocations] = useState<
    [
      {
        name: string | undefined;
        place_id: string | undefined;
      },
    ]
  >([{ name: undefined, place_id: undefined }]);
  const [multipleLocations, setMultipleLocations] = useState(false);

  useEffect(() => {
    setCountryFlag(
      getFlagEmoji(currentUser?.idVerification?.fields?.address?.country),
    );
    getCallingCode(currentUser?.idVerification?.fields?.address?.country).then(
      (code: string) => {
        setCountryCode(`+${code}`);
      },
    );
  }, []);

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .required("Required")
      .email("Please enter a valid email address"),
    phone: yup.string().required("Required"),
    cards_amount: yup.number().required("Required"),
    locations: yup.array(),
    custom_price: yup.number(),
  });

  const createSaleApi = async (values: any) => {
    let obj = {
      ...values,
      phone: countryCode + values["phone"],
      ...(customPrice.checked && { custom_price: customPrice.value }),
      locations: locations.slice(
        0,
        multipleLocations ? values.cards_amount : 1,
      ),
    };
    console.log("obj--->", obj);

    let arr: any = [];
    try {
      const resp = await createSale(obj);
      resp.data?.links?.links.map((item: any) => {
        arr.push({
          link: item,
          checked: false,
        });
      });

      dispatch(setSelectedCards(arr));
      if (resp?.data) {
        props.navigation.navigate("TakePayment", { stripLink: resp?.data });
        scheduleSaleReminderNotification(true);
      } else if (resp?.error) {
        Toast.show(resp.error.data.message, {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
      } else {
        console.log("error in sale bro");
      }
    } catch (error) {
      console.log("error---in sale->", error);
    }
  };
  return (
    <View style={styles.container}>
      <Header
        title={t("Create Sale")}
        leftButton={() => props.navigation.goBack()}
      />
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
                  placeholder={t("Email address of business")}
                />
                {errors.email && touched.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
                <TouchableOpacity
                  style={styles.inputViewStyle}
                  onPress={() => setShow(true)}
                >
                  {countryCode ? (
                    <Text style={{ width: "20%", marginLeft: 10 }}>
                      {countryFlag + " " + countryCode}
                    </Text>
                  ) : (
                    <Text style={{ width: "15%", marginLeft: 10 }}>🏳️ +0</Text>
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
                      width: countryCode ? "70%" : "80%",
                    }}
                    autoCapitalize={"none"}
                    placeholder={t("Phone number of business")}
                    keyboardType="number-pad"
                    // onPressIn={() => setShow(true)}
                  />
                </TouchableOpacity>
                {errors.phone && touched.phone && (
                  <Text style={styles.errorText}>{t(errors.phone)}</Text>
                )}

                <View style={{ zIndex: 100 }}>
                  <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    style={styles.dropDownContainer}
                    placeholder={t("Select card bundle")}
                    placeholderStyle={{ color: "#ccc" }}
                    dropDownContainerStyle={styles.dropDownContainerList}
                    renderListItem={({ item, onPress, value }) => (
                      <TouchableOpacity
                        style={styles.listItem}
                        onPress={() => {
                          _formik?.current?.setFieldValue(
                            "cards_amount",
                            value,
                          );
                          setValue(value);
                          setCustomPrice({
                            ...customPrice,
                            value: getPrice(value, currentUser?.currency),
                          });
                          setOpen(false);
                        }}
                      >
                        <View style={{ flexDirection: "row" }}>
                          {item?.icon()}
                          <View style={{ marginTop: 5, marginLeft: 10 }}>
                            <Text>{item?.label}</Text>
                            <View
                              style={{
                                flexDirection: "row",
                                marginTop: 5,
                              }}
                            >
                              <Text style={{ color: "green" }}>
                                {getCurrencySymbol(currentUser.currency)}
                                {getPrice(item.value, currentUser.currency)}
                              </Text>
                              <Text
                                style={{
                                  textDecorationLine: "line-through",
                                  marginLeft: 10,
                                  color: "gray",
                                }}
                              >
                                {getCurrencySymbol(currentUser.currency)}
                                {getPrice(item.value, currentUser.currency) * 2}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </View>
                {errors.cards_amount && touched.cards_amount && (
                  <Text style={styles.errorText}>{errors.cards_amount}</Text>
                )}

                {(currentUser.role === "trustedSeller" ||
                  currentUser?.role == "premiumSeller") && (
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ fontWeight: "500", width: 125 }}>
                          {t("Custom Price")}
                        </Text>
                        <CheckBox
                          checked={customPrice.checked}
                          checkedColor={tintColorDark}
                          size={20}
                          onPress={() => {
                            setCustomPrice({
                              ...customPrice,
                              checked: !customPrice.checked,
                              value: (
                                getPrice(
                                  _formik.current?.values.cards_amount,
                                  currentUser?.currency,
                                ) * (discount ? 0.85 : 1)
                              ).toFixed(2),
                            });
                          }}
                        />
                      </View>

                      {customPrice.checked && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <View>
                            <Text
                              style={{
                                fontWeight: "500",
                                fontSize: 12,
                              }}
                            >
                              {t("-15% discount")}
                            </Text>
                            <Text
                              style={{
                                fontSize: 10,
                                fontWeight: "400",
                                color: "#777",
                              }}
                            >
                              ({t("Recurring customer")})
                            </Text>
                          </View>
                          <CheckBox
                            checked={!!discount}
                            checkedColor={tintColorDark}
                            size={20}
                            onPress={() => {
                              if (discount) {
                                setDiscount(0);
                                setCustomPrice({
                                  ...customPrice,
                                  value: getPrice(
                                    _formik.current?.values.cards_amount,
                                    currentUser?.currency,
                                  ),
                                });
                              } else {
                                setDiscount(15);
                                setCustomPrice({
                                  ...customPrice,
                                  value: (
                                    getPrice(
                                      _formik.current?.values.cards_amount,
                                      currentUser?.currency,
                                    ) * 0.85
                                  ).toFixed(2),
                                });
                              }
                            }}
                          />
                        </View>
                      )}
                    </View>
                    {customPrice.checked && (
                      <View>
                        <Input
                          onChangeText={(text: number) =>
                            setCustomPrice({
                              ...customPrice,
                              value: text,
                            })
                          }
                          editable={currentUser?.role === "premiumSeller"}
                          onBlur={handleBlur("cards_amount")}
                          value={String(customPrice.value)}
                          style={{ ...styles.inputField }}
                          inputViewStyle={styles.inputViewStyle}
                          iconColor={"#ccc"}
                          placeholder={t("Enter custom price")}
                          keyboardType="number-pad"
                          rightText={currentUser?.currency}
                        />
                      </View>
                    )}
                  </View>
                )}

                {(currentUser.role === "trustedSeller" ||
                  currentUser?.role == "premiumSeller") &&
                  values.cards_amount > 1 && (
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ fontWeight: "500", width: 125 }}>
                          Multiple locations
                        </Text>
                        <CheckBox
                          checked={multipleLocations}
                          checkedColor={tintColorDark}
                          size={20}
                          onPress={() => {
                            setMultipleLocations(!multipleLocations);
                          }}
                        />
                      </View>
                    </View>
                  )}

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 4,
                    marginBottom: 2,
                  }}
                >
                  <Image
                    source={googleLogo}
                    style={{ width: 18, height: 18 }}
                  />
                  <Text style={{ fontWeight: "500" }}>
                    {t("Google Business")}
                  </Text>
                </View>
                {[
                  ...Array(
                    multipleLocations && _formik?.current?.values.cards_amount
                      ? _formik?.current?.values.cards_amount
                      : 1,
                  ),
                ].map((_, i) => (
                  <GoogleInput
                    handleBlur={handleBlur}
                    locations={locations}
                    errors={errors}
                    handleChange={handleChange}
                    setLocations={setLocations}
                    touched={touched}
                    index={i}
                  />
                ))}
              </>
            )}
          </Formik>
        </View>

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
            {t(isScanned ? "Scan Complete" : "Ready to Scan")}
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
              {t(isScanned ? "Done" : "Cancel")}
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
          onBackdropPress={() => setShow(false)}
          onRequestClose={() => setShow(false)}
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
          <Text style={styles.buttonText}>{t("Create Sale")}</Text>
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
    height: 500,
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
  dropDownContainerList: {
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: "#cccccc60",
    // height: 250,
    maxHeight: hp(35),
  },
  dropDownContainer: {
    // borderWidth: 2,
    marginBottom: hp(1),
    borderColor: "#f9f9f9",
    backgroundColor: "#f9f9f9",
  },
  listItem: {
    height: hp(8),
    padding: 5,
  },
});
