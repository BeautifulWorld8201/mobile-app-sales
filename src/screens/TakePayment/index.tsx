import {
  StyleSheet,
  View,
  Image,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import Header from "../../../components/Header";
import { hp, wp } from "../../../utils";
import Text from "../../../components/Text";
import { tintColorDark } from "../../../constants/Colors";
import MyButton from "../../../components/Button";
import { useTranslation } from "react-i18next";
import QRCode from "react-native-qrcode-svg";
export default function TakePayment(props: any) {
  const { t } = useTranslation();

  const stripLink = props?.route?.params?.stripLink;

  const [visible, setVisible] = useState(false);

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

        <Modal animationType="fade" transparent={true} visible={visible}>
          <TouchableWithoutFeedback onPress={() => setVisible(!visible)}>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.modalContent}>
                  <TouchableOpacity
                    onPress={() => setVisible(!visible)}
                    style={styles.closeButton}
                  >
                    <Image
                      source={require("../../../assets/images/close.png")}
                      style={styles.crossButton}
                    />
                  </TouchableOpacity>
                  <View style={styles.qrCodeContainer}>
                    <QRCode
                      value={stripLink?.links?.payment_link?.url}
                      size={200}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
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
        <MyButton style={styles.button} onPress={() => setVisible(!visible)}>
          <Text style={styles.buttonText}>{t("Show QR")}</Text>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButton: {
    alignSelf: "flex-end",
    height: 20,
    width: 20,
  },
  closeText: {
    color: "blue",
    fontSize: 16,
    fontWeight: "bold",
  },
  qrCodeContainer: {
    marginVertical: 20,
  },
  crossButton: {
    width: 15,
    height: 15,
    tintColor: "gray",
  },
});
