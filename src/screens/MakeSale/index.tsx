import { StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Text, View } from "../../../components/Themed";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { useEffect, useState } from "react";
import { useGetSalesMutation } from "../../../redux/sale/saleApiSlice";
import Header from "../../../components/Header";
import { formatDateTime, hp, wp } from "../../../utils";
import { tintColorDark } from "../../../constants/Colors";
import Button from "../../../components/Button";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

export default function MakeSale(props: any) {
  const [getSales, getSalesResp] = useGetSalesMutation();
  const [sales, setSales] = useState([]);
  useEffect(() => {
    getSalesApi();
  }, []);
  const getSalesApi = async () => {
    try {
      const resp = await getSales();

      setSales(resp?.data?.sales);
    } catch (error) {
      console.log("-----error in get sale----", error);
    }
  };

  const renderItem = (item: any, index: number) => {
    return (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() =>
          props.navigation.navigate("SaleDetail", {
            sale: item,
          })
        }
      >
        <View style={styles.listItemTop}>
          <Text style={{ color: "#ccc", fontSize: 12 }}>#{index + 1} </Text>
          <Text style={{ color: "#ccc", fontSize: 12 }}>
            {/* · {moment(item?.client?.createdAt).calendar()} */}·{" "}
            {formatDateTime(item?.createdAt)}
          </Text>
        </View>
        <View style={styles.listItemMiddle}>
          <Text style={{ fontWeight: "500" }}>{item?.client?.name}</Text>
          <Text>
            {item?.price?.amount} {item?.price?.currency}
          </Text>
        </View>
        <View style={styles.listItemMiddle}>
          <View style={styles.listStats}>
            <View
              style={{
                ...styles?.paidCard,
                width: item?.payment_link?.paid ? 42 : 66,
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
                {item?.payment_link?.paid ? "Paid" : "Not Paid"}
              </Text>
            </View>
            <Text style={styles.cardAmount}>· {item?.cards_amount} cards</Text>
          </View>
          <Icon name="chevron-right" size={20} />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <Header title={"Sale"} />
      <View style={styles.innerContainer}>
        <View style={styles.buttonView}>
          <Text style={styles.credsFont}>Recent Sales</Text>

          <Button
            onPress={() => props.navigation.navigate("Sale")}
            style={styles.buttonBelow}
          >
            <Text style={styles.buttonText}>Make new Sale</Text>
          </Button>
        </View>
        <FlatList
          data={sales}
          renderItem={({ item, index }) => renderItem(item, index)}
          showsVerticalScrollIndicator={false}
          style={{
            marginBottom: hp(20),
          }}
          ListEmptyComponent={() => (
            <View style={{ marginTop: 200, alignItems: "center" }}>
              <Text>No Sales yet</Text>
            </View>
          )}
        />
      </View>
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
});
