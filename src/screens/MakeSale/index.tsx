import { StyleSheet } from "react-native";
import { Text, View, Button } from "../../../components/Themed";
import { useSelector, useDispatch } from "react-redux";
import { getRefreshedToken } from "../../helpers";
import { setAccessToken, setRefreshToken } from "../../../redux/auth/authSlice";

import { useSubmitApplicationMutation } from "../../../redux/user/userApiSlice";
import moment from "moment";
import { useEffect } from "react";
import useCheckToken from "../../helpers/useCheckToken";
export default function MakeSale(props: any) {
  const [submitApplication, { isLoading }] = useSubmitApplicationMutation();

  const { setTokens, checkTokenExpiry } = useCheckToken();

  const submitApplicationApi = async () => {
    const data = {
      professionalStatus: "student",
      inquiryId: "inq_FrrSyZso6KkzhP8XXVaTau93",
    };

    try {
      const resp = await submitApplication(data);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Make new Sale"
        onPress={() => props.navigation.navigate("Sale")}
      />

      <Button
        title="Test API"
        onPress={() => {
          submitApplicationApi();
          // console.log(setTokens());
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});
