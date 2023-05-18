import { StyleSheet } from "react-native";
import { Text, View, Button } from "../../../components/Themed";
import { useSelector, useDispatch } from "react-redux";
import { getRefreshedToken } from "../../helpers";
import { setAccessToken, setRefreshToken } from "../../../redux/auth/authSlice";

import { useSubmitApplicationMutation } from "../../../redux/user/userApiSlice";
import moment from "moment";
import { useEffect } from "react";

export default function MakeSale(props: any) {
  const dispatch = useDispatch();
  const refreshToken = useSelector((state) => state?.auth?.refreshToken?.token);
  const accessToken = useSelector((state) => state?.auth?.accessToken);

  const [submitApplication, { isLoading }] = useSubmitApplicationMutation();

  const setTokens = async () => {
    const resp = await getRefreshedToken(refreshToken);

    dispatch(setAccessToken(resp?.data?.tokens?.access));
    dispatch(setRefreshToken(resp?.data?.tokens?.refresh));

    return true;
  };

  const submitApplicationApi = async () => {
    const data = {
      professionalStatus: "student",
      inquiryId: "inq_FrrSyZso6KkzhP8XXVaTau93",
    };

    try {
      if (moment().isAfter(accessToken?.expires)) {
        const status = await setTokens();
        if (status) {
          const resp = await submitApplication(data);
        }
      } else {
        const resp = await submitApplication(data);
      }
    } catch (error) {
      console.log("error is here", error);
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
