import { StyleSheet, View, Image, ActivityIndicator } from "react-native";
import React from "react";
import { formatDateTime, hp, wp } from "../../../utils";
import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import Button from "../../../components/Button";
import Text from "../../../components/Text";

import {
  // useGetSaleDetailMutation,
  useGetSaleDetailQuery,
  useResendPaymentRequestMutation,
  useGetClientInfoMutation,
  useMarkAsPaidMutation,
} from "../../../redux/sale/saleApiSlice";
import { tintColorDark } from "../../../constants/Colors";
import RNModal from "react-native-modal";
import Toast from "react-native-root-toast";
import { AirbnbRating } from "react-native-ratings";
import { useSelector } from "react-redux";
import { shortenString } from "../../helpers/misc";

import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";

export default function SaleDetail(props: any) {
  const { t } = useTranslation();
  // const [getSaleDetail, { isLoading }] = useGetSaleDetailMutation();
  const {
    data: detail,
    isError,
    isLoading,
    refetch,
  } = useGetSaleDetailQuery(props?.route?.params?.sale?._id);
  const user = useSelector((state) => state?.auth?.loginUser);

  const [resendPaymentRequest, resendPaymentRequestResp] =
    useResendPaymentRequestMutation();
  const [getClientInfo, getClientInfoResp] = useGetClientInfoMutation();
  const [markAsPaid, markAsPaidResp] = useMarkAsPaidMutation();
  const [saleDetail, setSaleDetail] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [clientDetail, setClientDetail] = useState({});
  useEffect(() => {
    // getSaleDetailApi();
    setSaleDetail(detail?.sale);
    setClientDetail(detail?.businessInfo);
  }, [detail]);

  useEffect(() => {
    refetch();
  }, []);

  const getResendPaymentRequest = async () => {
    try {
      const resp = await resendPaymentRequest(saleDetail?.id);

      if (resp?.error?.data?.code == 429) {
        Toast.show(resp?.error?.data?.message, {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
      } else {
        Toast.show(t("Payment request sent!"), {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
      }
    } catch (error) {
      console.log("error in resend payment", error);
    }
  };

  const markAsPaidApi = async () => {
    try {
      const resp = await markAsPaid(saleDetail?.id);

      if (resp?.error?.data?.code == 406) {
        Toast.show(resp?.error?.data?.message, {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
      } else {
        Toast.show(t("Sale marked as paid!"), {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
        refetch();
      }
    } catch (error) {
      console.log("markAsPaidApi error", error);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Header
          title={t("Sale Detail")}
          leftButton={() => props.navigation.goBack()}
        />
        {isLoading ? (
          <View style={styles.activityIndicator}>
            <ActivityIndicator size="large" color={tintColorDark} />
          </View>
        ) : (
          <ScrollView style={styles.innerContainer} showsVerticalScrollIndicator={false}>
            <Image
              source={{
                uri:
                  clientDetail?.image ||
                  "https://orbis-alliance.com/wp-content/themes/consultix/images/no-image-found-360x260.png",
              }}
              style={{
                width: "100%",
                height: hp(20),
                borderRadius: 10,
                marginBottom: hp(2),
              }}
            />
            <View style={styles.itemView}>
              <Text style={styles.credsFont}>{t("Client")}:</Text>
              <Text style={styles.detailFont}>
                {shortenString(saleDetail?.client?.name)}
              </Text>
            </View>

            <View style={styles.itemView}>
              <Text style={styles.credsFont}>{t("Email address")}:</Text>
              <Text style={styles.detailFont}>
                {shortenString(saleDetail?.client?.email)}
              </Text>
            </View>

            <View style={styles.itemView}>
              <Text style={styles.credsFont}>{t("Phone number")}:</Text>
              <Text style={styles.detailFont}>
                {shortenString(saleDetail?.client?.phone)}
              </Text>
            </View>

            <View style={styles.itemView}>
              <Text style={styles.credsFont}>{t("Card amount")}:</Text>
              <Text style={styles.detailFont}>{saleDetail?.cards_amount}</Text>
            </View>
            <View style={styles.itemView}>
              <Text style={styles.credsFont}>{t("Price")}:</Text>
              <Text style={styles.detailFont}>
                {saleDetail?.price?.amount} {saleDetail?.price?.currency}
              </Text>
            </View>
            <View style={styles.itemView}>
              <Text style={styles.credsFont}>{t("Payment Status")}:</Text>
              {/* <Text style={styles.detailFont}>
					{saleDetail?.payment_link?.paid ? "Paid" : "Unpaid"}
				  </Text> */}
              <View
                style={{
                  ...styles?.paidCard,
                  width: saleDetail?.payment_link?.paid ? 42 : 66,
                  backgroundColor: saleDetail?.payment_link?.paid
                    ? "#2fbc362b"
                    : "#d300152b",
                  borderWidth: 1,
                  borderColor: saleDetail?.payment_link?.paid
                    ? "#21c729"
                    : "#ff0019",
                }}
              >
                <Text
                  style={{
                    ...styles.paidText,
                    color: saleDetail?.payment_link?.paid
                      ? "#21c729"
                      : "#ff0019",
                  }}
                >
                  {t(saleDetail?.payment_link?.paid ? "Paid" : "Not Paid")}
                </Text>
              </View>
            </View>
            <View style={styles.itemView}>
              <Text style={styles.credsFont}>{t("Date")}:</Text>
              <Text style={styles.detailFont}>
                {formatDateTime(saleDetail?.createdAt)}
              </Text>
            </View>

            <View style={styles.itemView}>
              <Text style={styles.credsFont}>{t("Address")}:</Text>
              <Text
                style={{
                  ...styles.detailFont,
                  textAlign: "right",
                  width: wp(50),
                }}
                numberOfLines={2}
              >
                {clientDetail?.formatted_address}
              </Text>
            </View>
            {clientDetail?.rating && (
              <View style={styles.itemView}>
                <Text style={styles.credsFont}>{t("Rating")}:</Text>

                <View style={{ ...styles.itemView, alignItems: "center" }}>
                  <AirbnbRating
                    defaultRating={clientDetail?.rating}
                    isDisabled
                    size={16}
                    showRating={false}
                    starContainerStyle={{ bottom: 5 }}
                  />
                  <Text
                    style={{
                      ...styles.detailFont,
                      fontSize: hp(1.5),
                    }}
                  >
                    ({clientDetail?.user_ratings_total})
                  </Text>
                </View>
              </View>
            )}
            {/* {renderModal()} */}
          </ScrollView>
        )}
        <>
          {(user?.role == "trustedSeller" || user?.role == "premiumSeller") &&
            saleDetail?.payment_link?.paid == false && (
              <View style={styles.buttonContainer}>
                <Button
                  style={styles.button}
                  onPress={() => {
                    markAsPaidApi();
                  }}
                  isLoading={markAsPaidResp?.isLoading}
                  disabled={markAsPaidResp?.isLoading}
                  loaderColor={styles.loaderColor}
                >
                  <Text style={styles.buttonText}>{t("Mark As paid")}</Text>
                </Button>
              </View>
            )}
          {saleDetail?.payment_link?.paid == false && (
            <View style={styles.buttonContainer}>
              <Button
                style={styles.button}
                onPress={() => {
                  getResendPaymentRequest();
                }}
                isLoading={resendPaymentRequestResp?.isLoading}
                disabled={resendPaymentRequestResp?.isLoading}
                loaderColor={styles.loaderColor}
              >
                <Text style={styles.buttonText}>
                  {t("Resend Payment Request")}
                </Text>
              </Button>
            </View>
          )}
        </>
      </View>
    </>
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
  button: {
    backgroundColor: tintColorDark,
    borderRadius: hp(5),
    height: hp(7),
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    // marginTop: hp(3),
    marginBottom: hp(3),
  },
  buttonText: {
    color: "white",
    fontSize: hp(2),
    fontWeight: "700",
  },
  buttonContainer: {
    alignItems: "center",
    backgroundColor: "white",
    // marginBottom: hp(3),
    paddingHorizontal: hp(2.5),
  },
  loaderColor: {
    color: "white",
  },
  detailFont: {
    fontWeight: "700",
    fontSize: hp(1.8),
    color: "#ccc",
    marginBottom: hp(1),
  },
  credsFont: {
    fontSize: hp(2),
    color: "black",
    fontWeight: "700",
    marginBottom: hp(1),
  },
  itemView: { flexDirection: "row", justifyContent: "space-between" },
  rnModalBody: {
    backgroundColor: "#fff",
    borderRadius: hp(1.5),
    padding: hp(2.5),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    // alignItems: "center",
    flex: 0.5,
  },
  paidCard: {
    borderRadius: 10,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  paidText: { fontSize: 12 },
  activityIndicator: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  clientImage: {
    width: "100%",
    height: hp(20),
    borderRadius: 10,
    marginBottom: hp(2),
  },
});
