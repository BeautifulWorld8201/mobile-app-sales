import { CheckBox } from "@rneui/base";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useRef, useState } from "react";
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
import { useTranslation } from "react-i18next";
import DropDownPicker from "react-native-dropdown-picker";

const BankDetail = (props: any) => {
  const { t } = useTranslation();
  const { country, paymentType } = props.route.params.data;
  const [selectedCoin, setCoin] = useState(null);
  const [routing, setRouting] = useState('')
  const [value, setValue] = useState("BSC (BEP20)");
  const [coins, setCoins] = useState([
    { id: 1, label: "BSC (BEP20)", value: 'BEP20' },
    { id: 2, label: "Ethereum (ERC20)", value: 'ERC20' },
    { id: 3, label: "Polygon", value: 'Polygon' },
    { id: 4, label: "Solana", value: 'Solana' },
    { id: 5, label: "Tron (TRC20)", value: 'TRC20' },
  ])
  const [open, setOpen] = useState(false);

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

  const validationSchemaCrypto = yup.object().shape({
    routing: yup.string("Required").required("Required"),
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
  const initialValuesCrypto = {
    routing: "",
    account: "",
  };
  const [payoutMethod, { isLoading }] = usePayoutMethodMutation();

  const payoutMethodApi = async (values) => {
    let data = {};
    data["region"] =
    country === "other" ? "Other" : country === "UAE" ? "UAE" : country === "europe" ? "EEA" : "USA";

    data["method"] = paymentType;
    if (paymentType != "crypto") {
      data["accountHolder"] = values?.accountHolderName;
    }
    if (paymentType == "paypal") {
      data["email"] = values?.email;
    } else {
      if (country == "europe" || country=='UAE') {
        if (paymentType != 'crypto') {
          data["bankName"] = values?.bankName;
        }
      }
      data["routing"] =paymentType=='crypto'?values.routing: country == "europe"|| country=='UAE' || country=="other" ? values.routing : values?.routingNumber;
      data["account"] = paymentType == 'crypto' ? values.account : country == "europe"|| country=='UAE' || country=="other" ? values.iban : values?.account;
    }

    try {
      const resp = await payoutMethod(data);

      if (resp?.data) {
        Toast.show("Payout added!", {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
        props.navigation.navigate("Settings");
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
        title={t("Bank Details")}
        leftButton={() => props.navigation.goBack()}
      />
      <View style={styles.innerContainer}>
        <Formik
          innerRef={_formik}
         
          initialValues={
            paymentType === "crypto"
              ? initialValuesCrypto :
              paymentType === "bank"
                ? country === "unitedstates"
                  ? intialValuesUS
                  : country === "europe" || country=='UAE'|| country=="other" 
                    ? intialValuesEU
                    : intialValuesPaypal
                : paymentType === "paypal"
                  ? intialValuesPaypal
                  : intialValuesPaypal
          }
         
          validationSchema={
            paymentType === "crypto" ?
              validationSchemaCrypto :
              country === "unitedstates"
                ? paymentType === "bank"
                  ? validationSchemaUS
                  : paymentType === "paypal"
                    ? validationSchemaPaypal

                    : validationSchemaPaypal
                : country === "europe" || country=='UAE' || country=="other"
                  ? paymentType === "bank"
                    ? validationSchemaEU
                    : paymentType === "paypal"
                      ? validationSchemaPaypal
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
            setFieldValue,
            errors,
            touched,
          }) => (
            <>
              {paymentType == 'crypto' ? null :
                <>
                  <Text style={styles.credsFont}>{t("Account holder name")}</Text>
                  <Input
                    onChangeText={handleChange("accountHolderName")}
                    onBlur={handleBlur("accountHolderName")}
                    value={values.accountHolderName}
                    style={styles.inputField}
                    icon
                    inputViewStyle={styles.inputViewStyle}
                    iconColor={"#ccc"}
                    autoCapitalize={"none"}
                    placeholder={t("Account holder name")}
                  />
                  {errors.accountHolderName && touched.accountHolderName && (
                    <Text style={styles.errorText}>
                      {t(errors.accountHolderName)}
                    </Text>
                  )}
                </>}

              {country == "europe" || 'UAE'
                ?
                paymentType == "bank" ? (
                  <>
                    <Text style={styles.credsFont}>{t("Bank name")}</Text>
                    <Input
                      onChangeText={handleChange("bankName")}
                      onBlur={handleBlur("bankName")}
                      value={values.bankName}
                      style={styles.inputField}
                      icon
                      inputViewStyle={styles.inputViewStyle}
                      iconColor={"#ccc"}
                      autoCapitalize={"none"}
                      placeholder={t("Bank name")}
                    />
                    {errors.bankName && touched.bankName && (
                      <Text style={styles.errorText}>
                        {t(errors.bankName)}
                      </Text>
                    )}
                    <Text style={styles.credsFont}>{t("SWIFT / BIC")}</Text>
                    <Input
                      onChangeText={handleChange("routing")}
                      onBlur={handleBlur("routing")}
                      value={values.routing}
                      style={styles.inputField}
                      icon
                      inputViewStyle={styles.inputViewStyle}
                      iconColor={"#ccc"}
                      autoCapitalize={"none"}
                      placeholder={t("SWIFT / BIC")}
                    />
                    {errors.routing && touched.routing && (
                      <Text style={styles.errorText}>
                        {t(errors.routing)}
                      </Text>
                    )}
                    <Text style={styles.credsFont}>{t("IBAN")}</Text>
                    <Input
                      style={styles.inputField}
                      onChangeText={handleChange("iban")}
                      onBlur={handleBlur("iban")}
                      value={values.iban}
                      icon
                      inputViewStyle={styles.inputViewStyle}
                      iconColor={"#ccc"}
                      autoCapitalize={"none"}
                      placeholder={t("IBAN")}
                    />
                    {errors.iban && touched.iban && (
                      <Text style={styles.errorText}>{t(errors.iban)}</Text>
                    )}
                  </>
                ) : null
                : country == "unitedstates"
                  ? paymentType == "bank" && (
                    <>
                      <Text style={styles.credsFont}>
                        {t("Routing Number")}
                      </Text>
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
                        placeholder={t("Routing Number")}
                      />
                      {errors.routingNumber && touched.routingNumber && (
                        <Text style={styles.errorText}>
                          {t(errors.routingNumber)}
                        </Text>
                      )}
                      <Text style={styles.credsFont}>
                        {t("Account Number")}
                      </Text>
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
                        placeholder={t("Account Number")}
                      />
                      {errors.account && touched.account && (
                        <Text style={styles.errorText}>
                          {t(errors.account)}
                        </Text>
                      )}
                    </>
                  ) : null}
              {paymentType == "crypto" ? (
                <>
                  <Text style={styles.credsFont}>{t("Select Chain")}</Text>
                  <View style={{ zIndex: 100 }}>
                    <DropDownPicker
                      open={open}
                      value={value}
                      items={coins}
                      setOpen={setOpen}
                      // setValue={setValue}
                      setValue={(val) => {
                        setFieldValue("routing", val());
                        setValue(val)
                      }}
                      setItems={setCoins}
                      style={styles.dropDownContainer}
                      placeholder="Select Chain"
                      dropDownContainerStyle={styles.dropDownContainerList}
                      onChangeValue={() => handleChange("routing")}
                    />
                  </View>
                  {errors.routing && touched.routing && (
                    <Text style={styles.errorText}>
                      {t(errors.routing)}
                    </Text>
                  )}
                  <Text style={styles.credsFont}>{t("Address")}</Text>
                  <Input
                    onChangeText={handleChange("account")}
                    onBlur={handleBlur("account")}
                    value={values.account}
                    style={styles.inputField}
                    icon
                    inputViewStyle={styles.inputViewStyle}
                    iconColor={"#ccc"}
                    autoCapitalize={"none"}
                    placeholder={t("Address")}
                  />
                  {errors.account && touched.account && (
                    <Text style={styles.errorText}>
                      {t(errors.account)}
                    </Text>
                  )}
                </>
              ) : null}
              {paymentType == "paypal" && (
                <>
                  <Text style={styles.credsFont}>
                    {t("PayPal email address")}
                  </Text>
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
                    placeholder={t("PayPal email address")}
                  />
                  {errors.email && touched.email && (
                    <Text style={styles.errorText}>{t(errors.email)}</Text>
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
          }}
          loaderColor={styles.loaderColor}
          isLoading={isLoading}
        >
          <Text style={styles.buttonText}>{t("Continue")}</Text>
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
