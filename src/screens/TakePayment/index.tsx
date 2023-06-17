import { StyleSheet, View, Image } from "react-native";
import React from "react";
import Header from "../../../components/Header";
import { hp, wp } from "../../../utils";
import Text from "../../../components/Text";
import { tintColorDark } from "../../../constants/Colors";
import MyButton from "../../../components/Button";
import { useTranslation } from "react-i18next";

export default function TakePayment(props: any) {
  const { t } = useTranslation();
  return (
    <>
      <View style={styles.container}>
        <Header
          title={t(
            props?.route?.params?.fromScreen == undefined
              ? "Take Payment"
              : "Success",
          )}
          leftButton={() => props.navigation.goBack()}
        />
        <View style={styles.innerContainer}>
          <Text style={styles.statusText}>
            {t(
              props?.route?.params?.fromScreen == undefined
                ? "Your client has received a secure payment request in their email. Please ask the client to check his email to complete the payment. Offer to assist them with any questions or concerns they may have during the payment process."
                : "Cards written successfully!",
            )}
          </Text>
          <Image
            source={
              props?.route?.params?.fromScreen == undefined
                ? require("../../../assets/images/checkMail.jpg")
                : require("../../../assets/images/successCheck.png")
            }
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <MyButton
          style={styles.button}
          onPress={() => {
            props?.route?.params?.fromScreen == undefined
              ? props.navigation.navigate("WriteCards")
              : props.navigation.navigate("MakeSale");
          }}
        >
          <Text style={styles.buttonText}>{t("Done")}</Text>
        </MyButton>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  credsFont: {
    fontWeight: "700",
    fontSize: hp(2),
    color: "black",
    marginBottom: hp(1),
  },
  innerContainer: {
    marginHorizontal: hp(2.5),
    marginTop: hp(2),
  },
  statusText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonText: {
    color: "white",
    fontSize: hp(2),
    fontWeight: "700",
  },
  buttonContainer: {
    alignItems: "center",
    // bottom: 0,
    backgroundColor: "white",
    paddingHorizontal: hp(2.5),
  },
  button: {
    backgroundColor: tintColorDark,
    borderRadius: hp(5),
    height: hp(7),
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(3),
  },
  image: {
    height: hp(20),
    width: wp(70),
    alignSelf: "center",
    borderRadius: 10,
    marginTop: hp(10),
  },
});
