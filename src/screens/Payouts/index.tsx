import { CheckBox } from "@rneui/base";
import React, { useState, useRef } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Button from "../../../components/Button";
import Header from "../../../components/Header";
import { hp, wp } from "../../../utils";
import Toast from "react-native-root-toast";
import { tintColorDark } from "../../../constants/Colors";
import { useTranslation } from "react-i18next";

const Payouts = (props: any) => {
  const refRBSheet = useRef();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("europe");
  const [selectedIndex, setIndex] = useState(null);
  const [items, setItems] = useState([
    { label: "Europe (EEA)", value: "europe", id: 1 },
    { label: "United States", value: "unitedstates", id: 2 },
    { label: "United Arab Emirates (UAE)", value: "UAE", id: 3 },
    { label: "Other", value: "other", id: 4 },
  ]);

  const bankList = [
    {
      id: 1,
      title: `Bank account in ${value == "europe" ? "EUR" : "USD"}`,
      fee: `• ${t("No fees")}`,
      days: `• ${t("3-5 business days")}`,
      image: require("../../../assets/images/bank.png"),
    },
    {
      id: 2,
      title: `PayPal in ${value == "europe" ? "EUR" : "USD"}`,
      fee: `• ${t("Paypal fees may apply")}`,
      days: `• ${t("1 business day")}`,
      image: require("../../../assets/images/paypal.png"),
    },
    {
      id: 3,
      title: `Crypto in USDT`,
      fee: `• ${t("Transaction fees may apply")}`,
      days: `• ${t("Instantly")}`,
      image: require("../../../assets/images/crypto.jpg"),
    },
  ];

  return (
    <View style={styles.container}>
      <Header
        title={t("Set up payouts")}
        leftButton={() => props.navigation.goBack()}
      />

      <ScrollView style={styles.innerContainer}>
        <Text style={styles.textMain}>{t("Let's add a payout method")}</Text>
        <Text style={styles.textintro}>
          {t("To start, let us know where you'd like us to send your money.")}
        </Text>
        <Text style={styles.textTitle}>{t("Billing country/region")}</Text>

        <View style={{ zIndex: 100 }}>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            style={styles.dropDownContainer}
            placeholder="Billing country/region"
            dropDownContainerStyle={styles.dropDownContainerList}
            onChangeValue={(val) => {
              setIndex(null);
            }}
          />
        </View>

        <Text style={styles.textTitle}>
          {t("How would you like to get paid?")}
        </Text>

        <>
          {value == "other" ? (
            bankList.map((item, index) => {
              return (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      setIndex(index);
                    }}
                    style={styles.payoutCard}
                    key={index}
                  >
                    <Image style={styles.bankIcon} source={item.image} />
                    <View style={{ width: wp(55) }}>
                      <Text style={styles.textBank}>{item.title}</Text>
                      <Text style={styles.fadeIcon}>{item.days}</Text>
                      <Text style={styles.fadeIcon}>{item.fee}</Text>
                    </View>
                    <CheckBox
                      checked={selectedIndex === index}
                      onPress={() => {
                        setIndex(index);
                      }}
                      checkedIcon="dot-circle-o"
                      uncheckedIcon="circle-o"
                      checkedColor={tintColorDark}
                    />
                  </TouchableOpacity>
                  <View style={styles.divider} />
                </>
              );
            })
          ) : (
            <>
              {bankList.map((item, index) => {
                return (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        setIndex(index);
                      }}
                      style={styles.payoutCard}
                      key={index}
                    >
                      <Image style={styles.bankIcon} source={item.image} />
                      <View style={{ width: wp(55) }}>
                        <Text style={styles.textBank}>{item.title}</Text>
                        <Text style={styles.fadeIcon}>{item.days}</Text>
                        <Text style={styles.fadeIcon}>{item.fee}</Text>
                      </View>
                      <CheckBox
                        checked={selectedIndex === index}
                        onPress={() => {
                          setIndex(index);
                        }}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        checkedColor={tintColorDark}
                      />
                    </TouchableOpacity>
                    <View style={styles.divider} />
                  </>
                );
              })}
            </>
          )}
        </>
      </ScrollView>

      <Button
        style={styles.button}
        onPress={() => {
          if (value == null) {
            Toast.show(t("Please select country"), {
              duration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM,
            });
          } else if (selectedIndex == null) {
            Toast.show(t("Please select payment method"), {
              duration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM,
            });
          } else {
            let data = {
              country: value,
              paymentType:
                selectedIndex == 0
                  ? "bank"
                  : selectedIndex == 1
                  ? "paypal"
                  : selectedIndex == 2
                  ? "crypto"
                  : "paypal",
            };

            props.navigation.navigate("BankDetail", { data });
          }
        }}
        // loaderColor={styles.loaderColor}
      >
        <Text style={styles.buttonText}>{t("Continue")}</Text>
      </Button>
    </View>
  );
};

export default Payouts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: tintColorDark,
    borderRadius: hp(5),

    height: hp(7),

    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: hp(3),
    marginTop: hp(1),
    width: wp(90),
  },
  chainTxt: {
    color: "black",
    fontSize: 22,
    marginVertical: 10,
    alignSelf: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContant: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    padding: 20,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    shadowColor: "black",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 20,
  },
  buttonText: {
    color: "white",
    fontSize: hp(2),
    fontWeight: "700",
  },
  textMore: {
    textDecorationLine: "underline",
    fontSize: 16,
    paddingVertical: hp(1.5),
    color: "#000",
  },
  innerContainer: {
    width: wp(90),
    alignSelf: "center",
    paddingVertical: hp(2),
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#DEDEDE",
  },
  textTitle: {
    fontWeight: "500",
    fontSize: 22,
    paddingVertical: hp(1.5),
  },

  textBank: {
    fontWeight: "500",
    fontSize: wp(5),
    marginBottom: wp(2),
  },
  fadeIcon: {
    fontWeight: "500",
    fontSize: wp(4),
    color: "grey",
  },
  textfaded: {
    fontSize: 16,
    paddingVertical: hp(1.5),
    color: "grey",
  },
  textMain: {
    fontWeight: "bold",
    fontSize: 22,
    paddingVertical: hp(2),
  },
  textintro: {
    fontSize: 18,
  },
  dropDownContainerList: {
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: "#cccccc60",
  },
  dropDownContainer: {
    borderWidth: 2,
    marginBottom: hp(1),
    borderColor: "#cccccc60",
  },
  payoutCard: {
    height: hp(12),
    flexDirection: "row",
    // marginTop: hp(1),
    justifyContent: "space-around",
  },
  divider: {
    height: wp(0.2),
    width: "100%",
    backgroundColor: "#DEDEDE",
    marginVertical: hp(1),
  },
  bankIcon: {
    height: wp(10),
    width: wp(10),
  },
});
