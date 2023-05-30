import { StyleSheet } from "react-native";

import { Text, View, Button } from "../../../components/Themed";
import { useLogoutUserMutation } from "../../../redux/auth/authApiSlice";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../../../redux/auth/authSlice";
export default function Settings(props: any) {
  const dispatch = useDispatch();
  const refreshToken = useSelector((state) => state?.auth?.refreshToken?.token);
  const user = useSelector((state) => state?.auth?.loginUser);

  const [logoutUser, { isLoading }] = useLogoutUserMutation();
  const logoutApi = async () => {
    const data = {
      refreshToken,
    };
    try {
      const resp = await logoutUser(data);

      dispatch(logOut());
    } catch (error) {
      console.log("---error--logout-", error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SETTINGS</Text>
      <Text>Connected as: {user?.username} [{user?.email}]</Text>
      <Button title="Logout" onPress={() => logoutApi()} />
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
});
