import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useState } from "react";
import Button from "../../../components/Button";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { Text, View } from "../../../components/Themed";
import { useSelector, useDispatch } from "react-redux";

import {
  // useGetSalesMutation,
  useGetSalesQuery,
} from "../../../redux/sale/saleApiSlice";

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
import { useGetCurrentUserQuery, useGetPayoutMethodQuery } from "../../../redux/user/userApiSlice";
import { ScrollView } from "react-native-gesture-handler";

import { useTranslation } from "react-i18next";

export default function MakeSale(props: any) {
  const { t, i18n } = useTranslation();

  // const salesFromStore = useSelector((state) => state.sale.currentSales);

  const language = useSelector((state: { language: string }) => state.language);

  useEffect(() => {
    if (language !== i18n.language) i18n.changeLanguage(language);
  }, [language]);

  const dispatch = useDispatch();

  const periodSelectorData = [
    {
      label: "Today",
      value: "today",
    },
    {
      label: "7 days",
      value: "7d",
    },
    {
      label: "30 days",
      value: "30d",
    },
    {
      label: "All Time",
      value: "",
    },
  ];

  // const [getSales, { isLoading }] = useGetSalesMutation();
  const [selectedPeriod, setSelectedPeriod] = useState(periodSelectorData[2]);
  const {
    data: saleData,
    isError,
    isLoading,
    refetch,
    isFetching,
  } = useGetSalesQuery(selectedPeriod?.value);
  const { data: currentUser } = useGetCurrentUserQuery();
  const { data: payoutMethod } = useGetPayoutMethodQuery();
  const [sales, setSales] = useState([]);

  const onClickPeriod = (selectedPeriod) => {
    setSelectedPeriod(selectedPeriod);
  };

  //   console.log(sales?.stats, "STATS");

  useEffect(() => {
    setSales(saleData);
  }, [saleData]);

  // const getSalesApi = async () => {
  //   setIsFetching(true);
  //   try {
  //     const resp = await getSales();
  //     if (resp?.data) {
  //       setIsFetching(false);
  //       dispatch(setCurrentSales(resp?.data?.sales));
  //       // setSales(resp?.data?.sales);
  //     }
  //   } catch (error) {
  //     setIsFetching(false);

  //     console.log("-----error in get sale----", error);
  //   }
  // };

  const renderItem = (item: any, index: number) => {
    return (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => {
          props.navigation.navigate("SaleDetail", {
            sale: item,
          });
        }}
      >
        <View style={styles.listItemTop}>
          <Text style={{ color: "#ccc", fontSize: 12 }}>#{index + 1} </Text>
          <Text style={{ color: "#ccc", fontSize: 12 }}>
            {/* · {moment(item?.client?.createdAt).calendar()} */}·{" "}
            {formatDateTime(item?.createdAt)}
          </Text>
        </View>
        <View style={styles.listItemMiddle}>
          <Text style={{ fontWeight: "500" }}>
            {shortenString(item?.client?.name, 30)}
          </Text>
          <Text>
            {item?.price?.amount} {item?.price?.currency}
          </Text>
        </View>
        <View style={styles.listItemMiddle}>
          <View style={styles.listStats}>
            <View
              style={{
                ...styles?.paidCard,
                paddingHorizontal: 8,
                backgroundColor: item?.payment_link?.paid
                  ? `#2fbc362b`
                  : `#d300152b`,
                borderWidth: 1,
                borderColor: item?.payment_link?.paid ? `#21c729` : `#ff0019`,
              }}
            >
              <Text
                style={{
                  ...styles.paidText,
                  color: item?.payment_link?.paid ? "#21c729" : "#ff0019",
                }}
              >
                {t(item?.payment_link?.paid ? "Paid" : "Not Paid")}
              </Text>
            </View>
            <Text style={styles.cardAmount}>
              · {item?.cards_amount} {t("cards")}
            </Text>
          </View>
          <Icon name="chevron-right" size={20} />
        </View>
      </TouchableOpacity>
    );
  };

  const onRefresh = () => {
    refetch();
  };

  return (
    <View style={styles.container}>
      <Header title={t("Sales")} />

      <>
        <ScrollView
          style={styles.innerContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={() => onRefresh()}
            />
          }
        >
          {isLoading ? (
            <View style={styles.indicator}>
              <ActivityIndicator size="large" color={tintColorDark} />
            </View>
          ) : (
            <>
              <View style={styles.periodSelectorContainer}>
                {periodSelectorData?.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => onClickPeriod(item)}
                      style={[
                        styles.periodSelectorItem,
                        selectedPeriod?.label == item?.label &&
                          styles.periodSelectorItemSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.periodSelectorItemText,
                          selectedPeriod?.label == item?.label &&
                            styles.periodSelectorItemTextSelected,
                        ]}
                      >
                        {t(item?.label)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={styles.salesDataPointsContainer}>
                <View style={styles.salesDataPointItem}>
                  <Text style={styles.salesDataPointItemLabel}>
                    {t("Paid Sales")}
                  </Text>
                  <Text style={styles.salesDataPointItemValue}>
                    {getCurrencySymbol(currentUser?.currency)}
                    {formatNumber(sales?.stats?.paid?.amount ?? 0)}
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
                    {getCurrencySymbol(currentUser?.currency)}
                    {formatNumber(sales?.stats?.unpaid?.amount ?? 0)}
                  </Text>
                </View>
              </View>
              <View style={styles.buttonView}>
                <Text style={styles.credsFont}>{t("Recent Sales")}</Text>

                <Button
                  onPress={() => {
                    if (payoutMethod?.id) {
                      props.navigation.navigate("Sale")
                    } else {
                      Alert.alert(t("You need to add a payout method before starting to make sales"), "", [
                        {
                          text: t("Cancel"),
                          style: "cancel",
                        },
                        {
                          text: t("Add payout method"),
                          onPress: () => props.navigation.navigate("Payouts"),
                        },
                      ]);
                    }
                  }}
                  style={styles.buttonBelow}
                >
                  <Text style={styles.buttonText}>{t("Make new Sale")}</Text>
                </Button>
              </View>

              <FlatList
                data={sales?.sales}
                renderItem={({ item, index }) => renderItem(item, index)}
                showsVerticalScrollIndicator={false}
                style={{
                  marginBottom: hp(20),
                }}
                ListEmptyComponent={() => (
                  <View style={{ marginTop: 200, alignItems: "center" }}>
                    <Text>{t("No Sales yet")}</Text>
                  </View>
                )}
                // refreshing={isFetching}

                // refreshing={isFetching}
              />
            </>
          )}
        </ScrollView>
      </>
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
    fontSize: hp(1.2),
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
