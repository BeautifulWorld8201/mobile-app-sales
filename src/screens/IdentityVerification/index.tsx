import React, { useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import Header from "../../../components/Header";
import DropDownPicker from "react-native-dropdown-picker";
import { hp, wp } from "../../../utils";
import Input from "../../../components/Input";
import { Inquiry, Environment } from "react-native-persona";
import { Button } from "../../../components/Themed";

export default function IdentityVerification(props: any) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Student", value: "student" },
    { label: "Employee", value: "employee" },
    { label: "Other", value: "other" },
  ]);
  const [otherValue, setOtherValue] = useState("");
  return (
    <View style={styles.container}>
      <Header
        title={"Identity Verification"}
        leftButton={() => props.navigation.goBack()}
      />
      <View style={styles.innerContainer}>
        <Text style={styles.credsFont}>What’s your professional status?</Text>

        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          style={styles.dropDownContainer}
          dropDownContainerStyle={styles.dropDownContainerList}
        />
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
                Alert.alert(
                  "Complete",
                  `Inquiry ${inquiryId} completed with status "${status}."`
                )
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
  },
  inputViewStyle: {
    flexDirection: "row",
    width: "100%",

    height: hp(6),
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    marginBottom: hp(1),
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
