import { StyleSheet, Text, View } from "react-native";
import React, { useRef } from "react";
import Header from "../../../components/Header";
import { hp, wp } from "../../../utils";
import Input from "../../../components/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Formik } from "formik";
import * as yup from "yup";
import Button from "../../../components/Button";
import { usePayoutMethodMutation } from "../../../redux/user/userApiSlice";
import { tintColorDark } from "../../../constants/Colors";
import Toast from "react-native-root-toast";

const BankDetail = (props: any) => {
  const { country, paymentType } = props.route.params.data;

  const _formik = useRef();

  const validationSchemaPaypal = yup.object().shape({
    email: yup
      .string("Required")
      .required("Required")
      .email("Please enter a valid email address"),
    accountHolderName: yup.string("Required").required("Required"),
  });

  const validationSchemaEU = yup.object().shape({
    bankName: yup.string("Required").required("Required"),
    accountHolderName: yup.string("Required").required("Required"),
    routing: yup.string("Required").required("Required"),
    iban: yup.string("Required").required("Required"),
  });

  const validationSchemaUS = yup.object().shape({
    accountHolderName: yup.string("Required").required("Required"),
    routingNumber: yup.string("Required").required("Required"),
    account: yup.string("Required").required("Required"),
  });

  const intialValuesUS = {
    routingNumber: "",
    account: "",
    accountHolderName: "",
  };
  const intialValuesEU = {
    bankName: "",
    accountHolderName: "",
    routing: "",
    iban: "",
  };
  const intialValuesPaypal = {
    email: "",
    accountHolderName: "",
  };

  const [payoutMethod, { isLoading }] = usePayoutMethodMutation();

  const payoutMethodApi = async (values) => {
    let data = {};
    data["region"] =
      country == "other" ? "Other" : country == "europe" ? "EEA" : "USA";
    data["method"] = paymentType;
    data["accountHolder"] = values?.accountHolderName;
    if (paymentType == "paypal") {
      data["email"] = values?.email;
    } else {
      if (country == "europe") {
        data["bankName"] = values?.bankName;
      }
      data["routing"] =
        country == "europe" ? values.routing : values?.routingNumber;
      data["account"] = country == "europe" ? values.iban : values?.account;
    }

    console.log("data--FINAL-->", data);

    try {
      const resp = await payoutMethod(data);

      if (resp?.data) {
        Toast.show("Payout added!", {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
      } else {
        Toast.show("Error", {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
      }
    } catch (error) {
      console.log("payout method error---", error);
    }
  };
  return (
    <KeyboardAwareScrollView style={styles.container}>
      <Header
        title={"Bank Details"}
        leftButton={() => props.navigation.goBack()}
      />
      <View style={styles.innerContainer}>
        <Formik
          innerRef={_formik}
          initialValues={
            country == "unitedstates"
              ? paymentType == "bank"
                ? intialValuesUS
                : intialValuesPaypal
              : country == "europe"
              ? paymentType == "bank"
                ? intialValuesEU
                : intialValuesPaypal
              : intialValuesPaypal
          }
          validationSchema={
            country == "unitedstates"
              ? paymentType == "bank"
                ? validationSchemaUS
                : validationSchemaPaypal
              : country == "europe"
              ? paymentType == "bank"
                ? validationSchemaEU
                : validationSchemaPaypal
              : validationSchemaPaypal
          }
          validateOnBlur={false}
          onSubmit={(values) => payoutMethodApi(values)}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <Text style={styles.credsFont}>Account holder name</Text>
              <Input
                onChangeText={handleChange("accountHolderName")}
                onBlur={handleBlur("accountHolderName")}
                value={values.accountHolderName}
                style={styles.inputField}
                icon
                inputViewStyle={styles.inputViewStyle}
                iconColor={"#ccc"}
                autoCapitalize={"none"}
                placeholder={"Account holder name"}
              />
              {errors.accountHolderName && touched.accountHolderName && (
                <Text style={styles.errorText}>{errors.accountHolderName}</Text>
              )}
              {country == "europe"
                ? paymentType == "bank" && (
                    <>
                      <Text style={styles.credsFont}>Bank name</Text>
                      <Input
                        onChangeText={handleChange("bankName")}
                        onBlur={handleBlur("bankName")}
                        value={values.bankName}
                        style={styles.inputField}
                        icon
                        inputViewStyle={styles.inputViewStyle}
                        iconColor={"#ccc"}
                        autoCapitalize={"none"}
                        placeholder={"Bank name"}
                      />
                      {errors.bankName && touched.bankName && (
                        <Text style={styles.errorText}>{errors.bankName}</Text>
                      )}
                      <Text style={styles.credsFont}>SWIFT / BIC</Text>
                      <Input
                        onChangeText={handleChange("routing")}
                        onBlur={handleBlur("routing")}
                        value={values.routing}
                        style={styles.inputField}
                        icon
                        inputViewStyle={styles.inputViewStyle}
                        iconColor={"#ccc"}
                        autoCapitalize={"none"}
                        placeholder={"SWIFT / BIC"}
                      />
                      {errors.routing && touched.routing && (
                        <Text style={styles.errorText}>{errors.routing}</Text>
                      )}
                      <Text style={styles.credsFont}>IBAN</Text>
                      <Input
                        style={styles.inputField}
                        onChangeText={handleChange("iban")}
                        onBlur={handleBlur("iban")}
                        value={values.iban}
                        icon
                        inputViewStyle={styles.inputViewStyle}
                        iconColor={"#ccc"}
                        autoCapitalize={"none"}
                        placeholder={"IBAN"}
                      />
                      {errors.iban && touched.iban && (
                        <Text style={styles.errorText}>{errors.iban}</Text>
                      )}
                    </>
                  )
                : country == "unitedstates"
                ? paymentType == "bank" && (
                    <>
                      <Text style={styles.credsFont}>Routing Number</Text>
                      <Input
                        onChangeText={handleChange("routingNumber")}
                        onBlur={handleBlur("routingNumber")}
                        value={values.routingNumber}
                        style={styles.inputField}
                        icon
                        //   iconName="email"
                        inputViewStyle={styles.inputViewStyle}
                        iconColor={"#ccc"}
                        autoCapitalize={"none"}
                        placeholder={"Routing Number"}
                      />
                      {errors.routingNumber && touched.routingNumber && (
                        <Text style={styles.errorText}>
                          {errors.routingNumber}
                        </Text>
                      )}
                      <Text style={styles.credsFont}>Account Number</Text>
                      <Input
                        onChangeText={handleChange("account")}
                        onBlur={handleBlur("account")}
                        value={values.account}
                        style={styles.inputField}
                        icon
                        //   iconName="email"
                        inputViewStyle={styles.inputViewStyle}
                        iconColor={"#ccc"}
                        autoCapitalize={"none"}
                        placeholder={"Account Number"}
                      />
                      {errors.account && touched.account && (
                        <Text style={styles.errorText}>{errors.account}</Text>
                      )}
                    </>
                  )
                : null}

              {paymentType == "paypal" && (
                <>
                  <Text style={styles.credsFont}>PayPal email address</Text>
                  <Input
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    style={styles.inputField}
                    icon
                    //   iconName="email"
                    inputViewStyle={styles.inputViewStyle}
                    iconColor={"#ccc"}
                    autoCapitalize={"none"}
                    placeholder={"PayPal email address"}
                  />
                  {errors.email && touched.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </>
              )}
            </>
          )}
        </Formik>

        <Button
          style={styles.button}
          onPress={() => {
            _formik.current.handleSubmit();
            // console.log(_formik.current.errors);
          }}
          loaderColor={styles.loaderColor}
          isLoading={isLoading}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default BankDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
  button: {
    backgroundColor: tintColorDark,
    borderRadius: hp(5),

    height: hp(7),
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: hp(3),
    marginTop: hp(1),
    width: wp(90),
  },
  buttonText: {
    color: "white",
    fontSize: hp(2),
    fontWeight: "700",
  },
  innerContainer: {
    width: wp(90),
    alignSelf: "center",
    paddingVertical: hp(2),
    flex: 1,
  },
  credsFont: {
    fontWeight: "700",
    fontSize: hp(2),
    color: "black",
    marginBottom: hp(1),
    marginTop: hp(1),
  },
  inputField: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    marginVertical: 6,
    height: hp(6),

    width: "90%",
    color: "black",
  },
  errorText: {
    fontSize: 14,
    color: "red",
    marginBottom: hp(1),
  },
  loaderColor: {
    color: "white",
  },
});
