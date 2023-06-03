import { CheckBox } from "@rneui/base";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Button from "../../../components/Button";
import Header from "../../../components/Header";
import { hp, wp } from "../../../utils";
import Toast from "react-native-root-toast";
import { tintColorDark } from "../../../constants/Colors";

const Payouts = (props: any) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("europe");
  const [selectedIndex, setIndex] = useState(null);
  const [items, setItems] = useState([
    { label: "Europe (EEA)", value: "europe", id: 1 },
    { label: "United States", value: "unitedstates", id: 2 },
    { label: "Other", value: "other", id: 3 },
  ]);

  const bankList = [
    {
      id: 1,
      title: `Bank account in ${value == "europe" ? "EUR" : "USD"}`,
      fee: "• No fees",
      days: "• 3-5 business days",
      image: require("../../../assets/images/bank.png"),
    },
    {
      id: 2,
      title: `PayPal in ${value == "europe" ? "EUR" : "USD"}`,
      fee: "• Paypal fees may apply",
      days: "• 1 business day",
      image: require("../../../assets/images/paypal.png"),
    },
  ];
  return (
    <View style={styles.container}>
      <Header
        title={"Set up payouts"}
        leftButton={() => props.navigation.goBack()}
      />
      <ScrollView style={styles.innerContainer}>
        <Text style={styles.textMain}>Let's add a payout method</Text>
        <Text style={styles.textintro}>
          To start, let us know where you'd like us to send your money.
        </Text>
        <Text style={styles.textTitle}>Billing country/region</Text>

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

        <Text style={styles.textTitle}>How would you like to get paid?</Text>

        <>
          {value == "other" ? (
            <TouchableOpacity
              onPress={() => {
                setIndex(3);
              }}
              style={styles.payoutCard}
            >
              <Image
                style={styles.bankIcon}
                source={require("../../../assets/images/paypal.png")}
              />
              <View style={{ width: wp(55) }}>
                <Text style={styles.textBank}>PayPal in USD</Text>
                <Text style={styles.fadeIcon}>• 1 business day</Text>
                <Text style={styles.fadeIcon}>• Paypal fees may apply</Text>
              </View>
              <CheckBox
                checked={selectedIndex === 3}
                onPress={() => {
                  setIndex(3);
                }}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checkedColor={tintColorDark}
              />
            </TouchableOpacity>
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
            Toast.show("Please select country", {
              duration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM,
            });
          } else if (selectedIndex == null) {
            Toast.show("Please select payment method ", {
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
                  : "paypal",
            };

            props.navigation.navigate("BankDetail", { data });
          }
        }}
        // loaderColor={styles.loaderColor}
      >
        <Text style={styles.buttonText}>Continue</Text>
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
    height: hp(10),
    // backgroundColor: "red",
    flexDirection: "row",
    marginTop: hp(1),
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
