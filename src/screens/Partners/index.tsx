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
import { useGetUserEmployeeQuery } from "../../../redux/user/userApiSlice";
import { ScrollView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";

export default function Partners(props: any) {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const isLoading = useGetUserEmployeeQuery();

  const { data: employee, refetch, isFetching } = useGetUserEmployeeQuery();

  const renderItem = (item: any, index: number) => {
    return (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => {
          props.navigation.navigate("PartnerDetail", {
            uid: item.id,
            name: item?.username,
          });
        }}
      >
        <View style={styles.listItemTop}>
          <Text style={{ color: "#ccc", fontSize: 12 }}>#{index + 1} </Text>
        </View>
        <View style={styles.listItemMiddle}>
          <Text style={{ fontWeight: "500", fontSize: 15 }}>
            {shortenString(item?.username, 30)}
          </Text>
          <Text>
            {item?.price?.amount} {item?.currency}
          </Text>
        </View>
        <View style={styles.listItemMiddle}>
          {/* <View style={styles.listStats}> */}
          <Text style={styles.cardAmount}>{item?.email} </Text>
          {/* </View> */}
          <Icon name="chevron-right" size={20} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title={t("Partners")} />

      <>
        <ScrollView
          style={styles.innerContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetch} />
          }
        >
          <FlatList
            data={employee}
            renderItem={({ item, index }) => renderItem(item, index)}
            showsVerticalScrollIndicator={false}
            style={{
              marginBottom: hp(20),
            }}
            ListEmptyComponent={() => (
              <View style={{ marginTop: 10, alignItems: "center" }}>
                <Text>{t("No Partners yet")}</Text>
              </View>
            )}
          />
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
    // backgroundColor: '#ccc',s
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
  cardAmount: { fontSize: 12, color: "#ccc" },
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
  tinyLogo: {
    width: 50,
    height: 50,
  },
});
