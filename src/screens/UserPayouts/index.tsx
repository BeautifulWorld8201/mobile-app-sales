import { StyleSheet, View, Image, Alert } from "react-native";
import React, { useEffect } from "react";
import { hp, wp } from "../../../utils";
import Button from "../../../components/Button";
import Text from "../../../components/Text";
import Header from "../../../components/Header";
import {
  useGetPayoutMethodQuery,
  useDeletePayoutMethodMutation,
} from "../../../redux/user/userApiSlice";
import { tintColorDark } from "../../../constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Toast from "react-native-root-toast";
import { useIsFocused } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function UserPayouts(props: any) {
  const { t } = useTranslation();
  const focused = useIsFocused();

  const {
    data: payouts,
    isError,
    isLoading,
    refetch,
  } = useGetPayoutMethodQuery();

  const [deletePayoutMethod, deletePayoutMethodResp] =
    useDeletePayoutMethodMutation();

  // useEffect(() => {
  //   refetch();
  // }, [focused]);
  const deletePayout = async () => {
    try {
      const resp = await deletePayoutMethod(payouts?.id);

      if (resp) {
        Toast.show(t("Payout method deleted!"), {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <>
      <View style={styles.container}>
        <Header
          title={t("Payout Methods")}
          leftButton={() => props.navigation.goBack()}
        />
        <View style={styles.innerContainer}>
          {payouts ? (
            <View
              style={{
                height: hp(10),
                padding: 10,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Image
                  style={styles.bankIcon}
                  source={
                    payouts?.method == "bank"
                      ? require("../../../assets/images/bank.png")
                      : require("../../../assets/images/paypal.png")
                  }
                />
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: wp(73),
                    }}
                  >
                    <Text style={{ color: "#ccc" }}>{payouts?.region}</Text>
                  </View>

                  <Text
                    style={{
                      fontWeight: "500",
                      fontSize: 18,
                      marginBottom: hp(0.5),
                    }}
                  >
                    {payouts?.accountHolder}
                  </Text>
                  <Text>
                    {payouts?.bankName} - {payouts?.account}
                  </Text>
                </View>
              </View>
              <View style={styles.divider} />
            </View>
          ) : (
            props?.navigation?.navigate("Settings")
          )}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          onPress={() => {
            Alert.alert(t("Delete payout method"), "", [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "Yes",
                onPress: () => deletePayout(),
              },
            ]);
          }}
        >
          <Text style={styles.buttonText}>Delete payout method</Text>
        </Button>
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
  credsFont: {
    fontWeight: "700",
    fontSize: hp(2),
    color: "black",
    marginTop: hp(1),
  },
  button: {
    backgroundColor: "#d40101",
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
  divider: {
    height: wp(0.2),
    width: "100%",
    backgroundColor: "#DEDEDE",
    marginVertical: hp(1),
  },
  bankIcon: {
    height: wp(10),
    width: wp(10),
    alignSelf: "center",
    marginRight: hp(1),
  },
});
