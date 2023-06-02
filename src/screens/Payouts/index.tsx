import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Header from "../../../components/Header";
import { hp, wp } from "../../../utils";

const Payouts = (props: any) => {
  return (
    <View style={styles.container}>
      <Header
        title={"Set up payouts"}
        leftButton={() => props.navigation.goBack()}
      />
      <View style={styles.innerContainer}>
        <Text style={styles.textMain}>Let's add a payout method</Text>
        <Text style={styles.textintro}>
          To start, let us know where you'd like us to send your money.
        </Text>
        <Text style={styles.textTitle}>Billing country/region</Text>
        <Text style={styles.textfaded}>
          This is where you opened your financial account.
          <Text style={styles.textMore}> More info</Text>
        </Text>

        <Text style={styles.textTitle}>How would you like to get paid?</Text>
      </View>
    </View>
  );
};

export default Payouts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  textMore: {
    textDecorationLine: "underline",
    fontSize: 16,
    paddingVertical: hp(2),
    color: "#000",
  },
  innerContainer: {
    width: wp(90),
    alignSelf: "center",
    paddingVertical: hp(2),
  },
  textTitle: {
    fontWeight: "500",
    fontSize: 22,
    paddingVertical: hp(2),
  },
  textfaded: {
    fontSize: 16,
    paddingVertical: hp(2),
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
});
