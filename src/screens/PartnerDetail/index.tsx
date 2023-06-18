import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useState } from "react";
import Button from "../../../components/Button";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from "react-native";
import { Text, View } from "../../../components/Themed";
import { useSelector, useDispatch } from "react-redux";

import Header from "../../../components/Header";
import { setCurrentSales } from "../../../redux/sale/saleSlice";
import { tintColorDark } from "../../../constants/Colors";
import { useGetSalesMutation } from "../../../redux/sale/saleApiSlice";
import { formatDateTime, hp, wp } from "../../../utils";
import {
  formatNumber,
  getCurrencySymbol,
  shortenString,
} from "../../helpers/misc";
import { tintColorLight } from "../../../constants/Colors";
import { useGetUserEmployeeWithIdQuery } from "../../../redux/user/userApiSlice";
import { ScrollView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";

export default function PartnerDetail(props: any) {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const [uid, setUid] = useState(props?.route?.params?.uid);
  const [username, setuserName] = useState(props?.route?.params?.name);

  const {
    data: employeeData,
    isLoading,
    refetch,
  } = useGetUserEmployeeWithIdQuery(uid);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <View style={styles.container}>
      <Header
        title={t("Partner Details")}
        leftButton={() => props.navigation.goBack()}
      />

      {isLoading ? (
        <View style={styles.activityIndicator}>
          <ActivityIndicator size="large" color={tintColorDark} />
        </View>
      ) : (
        <ScrollView>
          <View
            style={{
              width: "90%",
              alignSelf: "center",
              marginVertical: 15,
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <View style={{}}>
              <Text
                style={{
                  fontSize: hp(2.8),
                  fontWeight: "400",
                }}
              >
                {username}
              </Text>
            </View>
            <View style={{}}>
              <Text
                style={{
                  fontSize: hp(1.8),
                  fontWeight: "300",
                  color: "#999",
                }}
              >
                {employeeData?.email} - {employeeData?.currency}
              </Text>
            </View>
          </View>

          <View style={styles.salesDataPointsContainer}>
            <View style={styles.salesDataPointItem}>
              <Text style={styles.salesDataPointItemLabel}>
                {t("Paid Sales")}
              </Text>
              <Text style={styles.salesDataPointItemValue}>
                {getCurrencySymbol(employeeData?.currency)} {""}
                {formatNumber(employeeData?.stats?.paid?.amount ?? 0)}
              </Text>
            </View>
            <View style={styles.salesDataPointDivider} />
            <View style={styles.salesDataPointItem}>
              <Text style={styles.salesDataPointItemLabel}>
                {t("Unpaid Sales")}
              </Text>
              <Text
                style={[
                  styles.salesDataPointItemValue,
                  styles.salesDataPointItemValueUnpaid,
                ]}
              >
                {getCurrencySymbol(employeeData?.currency)} {""}
                {formatNumber(employeeData?.stats?.unpaid?.amount ?? 0)}
              </Text>
            </View>
          </View>

          <View
            style={{ width: "90%", alignSelf: "center", marginVertical: 5 }}
          >
            <Text style={{ fontWeight: "500", fontSize: 20 }}>
              {t("Sales")}
            </Text>
          </View>
          <View>
            {employeeData?.sales.map((data, index) => (
              <>
                <View
                  style={styles.listItem}
                  onPress={() => {
                    props.navigation.navigate("SaleDetail", {
                      sale: data,
                    });
                  }}
                >
                  <View style={styles.listItemTop}>
                    <Text style={{ color: "#ccc", fontSize: 12 }}>
                      #{index + 1}{" "}
                    </Text>
                    <Text style={{ color: "#ccc", fontSize: 12 }}>
                      {/* · {moment(data?.client?.createdAt).calendar()} */}·{" "}
                      {formatDateTime(data?.createdAt)}
                    </Text>
                  </View>
                  <View style={styles.listItemMiddle}>
                    <Text style={{ fontWeight: "500" }}>
                      {shortenString(data?.client?.name, 30)}
                    </Text>
                    <Text>
                      {data?.price?.amount} {data?.price?.currency}
                    </Text>
                  </View>
                  <View style={styles.listItemMiddle}>
                    <View style={styles.listStats}>
                      <View
                        style={{
                          ...styles?.paidCard,
                          paddingHorizontal: 10,
                          backgroundColor: data?.payment_link?.paid
                            ? `#2fbc362b`
                            : `#d300152b`,
                          borderWidth: 1,
                          borderColor: data?.payment_link?.paid
                            ? `#21c729`
                            : `#ff0019`,
                        }}
                      >
                        <Text
                          style={{
                            ...styles.paidText,
                            color: data?.payment_link?.paid
                              ? "#21c729"
                              : "#ff0019",
                          }}
                        >
                          {t(
                            data?.payment_link?.paid
                              ? data?.payment_link?.manually_marked_as_paid
                                ? "Paid (Cash)"
                                : "Paid"
                              : "Not Paid",
                          )}
                        </Text>
                      </View>
                      <Text style={styles.cardAmount}>
                        · {data?.cards_amount} {t("cards")}
                      </Text>
                    </View>
                    {/* <Icon name="chevron-right" size={20} /> */}
                  </View>
                </View>
              </>
            ))}
          </View>
        </ScrollView>
      )}
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
  indicator: {
    marginTop: hp(30),
  },
  periodSelectorContainer: {
    height: hp(4),
    marginBottom: hp(1),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    // backgroundColor: tintColorDark,
    borderRadius: wp(1.5),
  },
  periodSelectorItem: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    borderRadius: wp(1),
    // marginLeft: wp(5),
  },
  periodSelectorItemSelected: {
    backgroundColor: "#ffbf003c",
  },
  periodSelectorItemText: {
    color: tintColorDark,
    fontSize: hp(1.5),
    fontWeight: "700",
  },
  periodSelectorItemTextSelected: {
    color: "#ff7b00",
  },
  salesDataPointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginBottom: hp(2),
    height: hp(6),
  },
  salesDataPointItem: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  salesDataPointItemLabel: {
    fontSize: hp(1.3),
    fontWeight: "600",
    color: "#999",
    textTransform: "uppercase",
  },
  salesDataPointItemValue: {
    fontSize: hp(4),
    fontWeight: "500",
  },
  salesDataPointItemValueUnpaid: {
    color: "#d50015",
  },
  salesDataPointDivider: {
    backgroundColor: "#ccc",
    width: 1,
    height: hp(4.5),
  },

  listItem: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 0.5,
    height: hp(10),
    paddingVertical: hp(1),
    padding: 10,
    width: "90%",
    alignSelf: "center",
    marginVertical: 5,
  },
  listItemTop: {
    flexDirection: "row",
    width: wp(50),
  },
  listItemMiddle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listStats: {
    flexDirection: "row",
    width: wp(40),

    marginTop: 4,
    alignItems: "center",
  },

  paidCard: {
    borderRadius: 10,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  paidText: { fontSize: 12 },
  cardAmount: { fontSize: 12, color: "#ccc", marginLeft: 4 },
  buttonBelow: {
    backgroundColor: tintColorDark,
    borderRadius: hp(1),
    height: hp(4),
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    // marginBottom: hp(2),
    // paddingHorizontal: hp(2.5),
  },

  buttonContainer: {
    alignItems: "center",
    // bottom: 0,
    backgroundColor: "white",
    // paddingHorizontal: hp(2.5),
  },
  buttonText: {
    color: "white",
    fontSize: hp(1.5),
    fontWeight: "700",
  },
  credsFont: {
    fontWeight: "700",
    fontSize: hp(2),
    color: "black",
    marginTop: hp(1),
  },
  buttonView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
  },
  activityIndicator: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp("30%"),
  },
});
