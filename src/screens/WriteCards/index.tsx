import { FlatList, StyleSheet, View, Image, Platform } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import Header from "../../../components/Header";
import { hp, wp } from "../../../utils";
import Text from "../../../components/Text";
import { tintColorDark } from "../../../constants/Colors";

import Button from "../../../components/Button";
import { useSelector, useDispatch } from "react-redux";
import RBSheet from "react-native-raw-bottom-sheet";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { setSelectedCards } from "../../../redux/sale/saleSlice";
import NfcManager, { Ndef, NfcTech } from "react-native-nfc-manager";
import RNModal from "react-native-modal";

NfcManager.start();

import { useTranslation } from "react-i18next";
import { shortenString } from "../../helpers/misc";

export default function WriteCards(props: any) {
  const { t } = useTranslation();
  const RBSheetRef = useRef();
  const dispatch = useDispatch();
  const selectedCards = useSelector((state) => state.sale.selectedCards);

  const [isScanned, setIsScanned] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    return () => {
      NfcManager.cancelTechnologyRequest();
    };
  }, []);
  useEffect(() => {
    const found = selectedCards.some((element) => element.checked == false);

    if (found == false) {
      // setIsVisible(true);
      props.navigation.navigate("TakePayment", {
        fromScreen: "writeCards",
      });
    }
  }, [selectedCards]);

  async function writeGoogleLinkOnNFC(link: {name: string, url: string}, index: any) {
    if (Platform.OS === "android") {
      setTimeout(() => {
        RBSheetRef?.current?.open();
      }, 500);
    }

    // const reviewLink = `https://search.google.com/local/writereview?placeid=${place_id}`;
    const reviewLink = link.url;

    let result = false;

    try {
      console.log("in try");
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const bytes = Ndef.encodeMessage([Ndef.uriRecord(reviewLink)]);
      if (bytes) {
        if (Platform.OS === "android") {
          RBSheetRef?.current?.close();
        }
        await NfcManager.ndefHandler.writeNdefMessage(bytes);
        result = true;
        // if (Platform.OS === "android") {
        //   setIsScanned(true);
        //   setTimeout(() => {
        //     RBSheetRef?.current?.open();
        //   }, 1000);
        // }
        let tempCards = [...selectedCards];
        tempCards[index] = {
          ...tempCards[index],
          checked: true,
        };

        dispatch(setSelectedCards(tempCards));
      }
    } catch (ex) {
      console.log(ex);
    } finally {
      NfcManager.cancelTechnologyRequest();
    }

    return result;
  }

  const renderCardItem = (item, index) => {
    return (
      <View style={styles.listView}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",

            alignItems: "center",
          }}
        >
         <View style={{flexDirection: 'row', gap: 16}}><Text style={{color: "#888", minWidth: 16}}>{index + 1}</Text>
          <Text>{shortenString(item?.link?.name)}</Text></View>
          {item?.checked ? (
            <Icon name={"check-circle"} color={"green"} size={25} />
          ) : (
            <Button
              style={styles.writeBtn}
              onPress={() => writeGoogleLinkOnNFC(item.link, index)}
            >
              <Text style={styles.writeText}>{t("Write")}</Text>
            </Button>
          )}
        </View>
      </View>
    );
  };

  const renderSuccessModal = () => {
    return (
      <RNModal
        isVisible={isVisible}
        onBackButtonPress={() => {
          setIsVisible(false);
          props.navigation.navigate("MakeSale");
        }}
        onBackdropPress={() => {
          setIsVisible(false);
          props.navigation.navigate("MakeSale");
        }}
        onRequestClose={() => {
          setIsVisible(false);
          props.navigation.navigate("MakeSale");
        }}
        hasBackdrop
        backdropOpacity={0.5}
        backdropColor="#000"
      >
        <View style={styles.rnModalBody}>
          <Text style={styles.statusText}>{"Success"}!</Text>
          <Image
            source={require("../../../assets/images/check.png")}
            style={styles.image}
          />
        </View>
      </RNModal>
    );
  };
  return (
    <View style={styles.container}>
      <Header
        title={t("Write Cards")}
        leftButton={() => props.navigation.goBack()}
      />
      <View style={styles.innerContainer}>
        <FlatList
          data={selectedCards}
          renderItem={({ item, index }) => renderCardItem(item, index)}
          style={{ marginBottom: hp(13) }}
          showsVerticalScrollIndicator={false}
        />
      </View>
      {renderSuccessModal()}
      <RBSheet
        ref={RBSheetRef}
        height={hp(37)}
        openDuration={250}
        customStyles={{
          container: {
            borderTopLeftRadius: hp(5),
            borderTopRightRadius: hp(5),
            padding: hp(3),
            backgroundColor: "#fff",
            alignItems: "center",
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

        <Button
          style={styles.button}
          onPress={() => {
            RBSheetRef?.current?.close();
            NfcManager.cancelTechnologyRequest();
            // if (isScanned) {
            //   setIsScanned(false);
            // }
          }}
        >
          <Text style={styles.buttonText}>
            {t(isScanned ? "Done" : "Cancel")}
          </Text>
        </Button>
      </RBSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  innerContainer: {
    marginHorizontal: hp(2.5),
    marginTop: hp(2),
  },
  listView: {
    height: hp(6),
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 0.5,
    marginBottom: hp(1),
    padding: 10,
  },
  writeBtn: {
    backgroundColor: tintColorDark,
    height: hp(3.5),
    paddingHorizontal: hp(2),
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  writeText: {
    color: "white",
    fontWeight: "bold",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "500",
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
  rnModalBody: {
    backgroundColor: "#fff",
    borderRadius: hp(1.5),
    padding: hp(2.5),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    alignItems: "center",
  },
  image: {
    height: hp(23.5),
    width: wp(45),
    alignSelf: "center",
  },
  statusText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
