import React, { useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import Header from "../../../components/Header";
import DropDownPicker from "react-native-dropdown-picker";
import { hp, wp } from "../../../utils";
import Input from "../../../components/Input";
import { Inquiry, Environment } from "react-native-persona";
import { Button } from "../../../components/Themed";
import useCheckToken from "../../helpers/useCheckToken";
import { useSubmitApplicationMutation } from "../../../redux/user/userApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setLoginUser } from "../../../redux/auth/authSlice";
import Toast from "react-native-root-toast";

export default function IdentityVerification(props: any) {
  const { setTokens, checkTokenExpiry } = useCheckToken();
  const [submitApplication, { isLoading }] = useSubmitApplicationMutation();
  const dispatch = useDispatch();

  const user = props?.route?.param?.user;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Student", value: "student" },
    { label: "Employee", value: "employee" },
    { label: "Other", value: "other" },
  ]);
  const [otherValue, setOtherValue] = useState("");

  const submitApplicationApi = async (inquiryId, status) => {
    const data = {
      professionalStatus: otherValue ? otherValue : value,
      inquiryId,
    };

    try {
      if (checkTokenExpiry()) {
        const status = await setTokens();

        if (status) {
          const resp = await submitApplication(data);
          if (resp?.error) {
            Toast.show(resp?.error?.data?.message, {
              duration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM,
            });
          } else {
            dispatch(setLoginUser(user));
            Toast.show(
              `Complete inquiry ${inquiryId} completed with status "${status}."`,
              {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
              }
            );
          }
        }
      } else {
        const resp = await submitApplication(data);
        if (resp?.error) {
          Toast.show(resp?.error?.data?.message, {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
          });
        } else {
          dispatch(setLoginUser(user));
          Toast.show(
            `Complete inquiry ${inquiryId} completed with status "${status}."`,
            {
              duration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM,
            }
          );
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <View style={styles.container}>
      <Header
        title={"Identity Verification"}
        leftButton={() => props.navigation.goBack()}
      />
      <View style={styles.innerContainer}>
        <Text style={styles.credsFont}>What’s your professional status?</Text>
        <View style={{ zIndex: 100 }}>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            style={styles.dropDownContainer}
            dropDownContainerStyle={styles.dropDownContainerList}
            onChangeValue={(val) => {
              if (val != "other") {
                setOtherValue("");
              }
            }}
          />
        </View>
        {value == "other" && (
          <>
            <Text style={styles.credsFont}>Please specify your status</Text>

            <Input
              onChangeText={(text: string) => setOtherValue(text)}
              value={otherValue}
              style={styles.inputField}
              inputViewStyle={styles.inputViewStyle}
              iconColor={"#ccc"}
              autoCapitalize={"none"}
              placeholder={"Other"}
            />
          </>
        )}
        <Button
          title="Start Inquiry"
          onPress={() => {
            Inquiry.fromTemplate("itmpl_8Bv8HzfgETE6aXgeFnAZ5Z4E")
              .environment(Environment.SANDBOX)
              .onComplete((inquiryId, status, fields) =>
                submitApplicationApi(inquiryId, status)
              )
              .onCanceled((inquiryId, sessionToken) =>
                Alert.alert("Canceled", `Inquiry ${inquiryId} was cancelled`)
              )
              .onError((error) => Alert.alert("Error", error.message))
              .build()
              .start();
          }}
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
  credsFont: {
    fontWeight: "700",
    fontSize: hp(2),
    color: "black",
    marginBottom: hp(1),
  },
  innerContainer: {
    marginHorizontal: hp(2.5),
    marginTop: hp(2),
  },
  inputField: {
    backgroundColor: "#cccccc60",
    borderRadius: 10,
    padding: 10,
    // marginVertical: 6,
    height: hp(6),

    width: "100%",
    color: "black",
    marginBottom: hp(2),
  },
  inputViewStyle: {
    flexDirection: "row",
    width: "100%",

    height: hp(6),
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },

  dropDownContainerList: {
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: "#cccccc60",
  },
  dropDownContainer: {
    borderWidth: 2,
    marginBottom: hp(1),
    borderColor: "#cccccc60",
  },
});
