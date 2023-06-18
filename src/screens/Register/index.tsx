import React, { useRef, useState } from "react";

import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Image } from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { View } from "../../../components/Themed";
import { hp, wp } from "../../../utils";
import Text from "../../../components/Text";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { Formik, useFormik } from "formik";
import * as yup from "yup";
import { tintColorDark } from "../../../constants/Colors";
import { useSignUpMutation } from "../../../redux/auth/authApiSlice";
import {
  setAccessToken,
  setRefreshToken,
  setLoginUser,
} from "../../../redux/auth/authSlice";
import { useDispatch } from "react-redux";
import Toast from "react-native-root-toast";

import { useTranslation } from "react-i18next";

export default function Register(props: any) {
  const { t } = useTranslation();
  const [signUp, { isLoading }] = useSignUpMutation();
  const _formik = useRef();
  const dispatch = useDispatch();
  const validationSchema = yup.object().shape({
    username: yup.string("Required").required("Name is required"),
    email: yup
      .string("Required")
      .required("Required")
      .email("Please enter a valid email address"),
    password: yup.string("Required").required("Required"),
  });

  const onSignUp = async (values: object) => {
    try {
      const resp = await signUp(values);

      if (resp?.error) {
        Toast.show(resp?.error?.data?.message, {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
      } else {
        dispatch(setAccessToken(resp?.data?.tokens?.access));
        dispatch(setRefreshToken(resp?.data?.tokens?.refresh));
        // dispatch(setLoginUser(resp?.data?.user));
        props.navigation.navigate("IdentityVerification", {
          user: resp?.data?.user,
        });
      }
    } catch (e) {
      console.log("register error--->", e);
    }
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={{ flexGrow: 1 }}>
        <View style={styles.imageView}>
          <Image
            style={styles.logo}
            source={require("../../../assets/images/logo1.png")}
            resizeMode="contain"
          />
        </View>

        <View style={styles.innerContainer}>
          <Text style={styles.loginFont}>{t("Register")}</Text>
          <Text style={styles.detailFont}>
            {t("Enter the details below to register your account")}
          </Text>

          <View>
            <Formik
              innerRef={_formik}
              initialValues={{
                username: "",
                email: "",
                password: "",
              }}
              validationSchema={validationSchema}
              validateOnBlur={false}
              onSubmit={(values) => onSignUp(values)}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View>
                  <Text style={styles.credsFont}>{t("User Name")}</Text>
                  <Input
                    onChangeText={(text) =>
                      handleChange("username")(text.replace(/\s/g, ""))
                    }
                    onBlur={handleBlur("username")}
                    value={values.username}
                    style={styles.inputField}
                    icon
                    iconName="account"
                    inputViewStyle={styles.inputViewStyle}
                    iconColor={"#ccc"}
                    autoCapitalize={"none"}
                    placeholder={t("Enter your user name")}
                  />
                  {errors.username && touched.username && (
                    <Text style={styles.errorText}>{t(errors.username)}</Text>
                  )}
                  <Text style={styles.credsFont}>Email</Text>
                  <Input
                    onChangeText={(text) =>
                      handleChange("email")(text.replace(/\s/g, ""))
                    }
                    onBlur={handleBlur("email")}
                    value={values.email}
                    style={styles.inputField}
                    icon
                    iconName="email"
                    inputViewStyle={styles.inputViewStyle}
                    iconColor={"#ccc"}
                    autoCapitalize={"none"}
                    placeholder={t("Enter your email address")}
                  />
                  {errors.email && touched.email && (
                    <Text style={styles.errorText}>{t(errors.email)}</Text>
                  )}
                  <Text style={{ ...styles.credsFont, marginTop: 10 }}>
                    {t("Password")}
                  </Text>
                  <Input
                    onChangeText={(text) =>
                      handleChange("password")(text.replace(/\s/g, ""))
                    }
                    onBlur={handleBlur("pasword")}
                    value={values.password}
                    style={styles.inputField}
                    secureTextEntry
                    icon
                    iconName="lock"
                    inputViewStyle={styles.inputViewStyle}
                    iconColor={"#ccc"}
                    autoCapitalize={"none"}
                    placeholder={t("Enter password")}
                  />
                  {errors.password && touched.password && (
                    <Text style={styles.errorText}>{t(errors.password)}</Text>
                  )}
                </View>
              )}
            </Formik>
            <View style={styles.buttonContainer}>
              <Button
                style={styles.button}
                onPress={() => {
                  _formik.current.handleSubmit();
                }}
                isLoading={isLoading}
                disabled={isLoading}
                loaderColor={styles.loaderColor}
              >
                <Text style={styles.buttonText}>{t("Register")}</Text>
              </Button>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.signupView}>
        <Text>{t("Already have an account?")} </Text>

        <Text
          style={styles.signupText}
          onPress={() => props.navigation.goBack()}
        >
          {t("Sign in")}
        </Text>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  imageView: {
    alignSelf: "center",
  },
  logo: {
    height: hp(9),
    width: wp(50),
    marginVertical: hp(6),
  },
  innerContainer: {
    marginHorizontal: hp(2.5),
  },
  loginFont: {
    fontWeight: "700",
    fontSize: hp(3),
    color: "black",
    marginBottom: hp(2),
  },
  detailFont: {
    // fontWeight: "500",
    fontSize: hp(2),
    marginBottom: hp(3),
  },
  credsFont: {
    fontWeight: "700",
    fontSize: hp(2),
    color: "black",
    marginBottom: hp(1),
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
  inputViewStyle: {
    flexDirection: "row",
    width: "100%",

    height: hp(6),
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    marginBottom: hp(1),
  },
  errorText: {
    fontSize: 14,
    color: "red",
    marginBottom: hp(1),
  },
  button: {
    backgroundColor: tintColorDark,
    borderRadius: hp(5),
    height: hp(7),
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(3),
  },
  buttonText: {
    color: "white",
    fontSize: hp(2),
    fontWeight: "700",
  },
  buttonContainer: {
    alignItems: "center",
  },
  loaderColor: {
    color: "white",
  },
  forgotText: {
    color: tintColorDark,
    textDecorationLine: "underline",
    alignSelf: "flex-end",
    fontWeight: "700",
    marginTop: hp(2),
  },
  signupText: {
    color: tintColorDark,
    textDecorationLine: "underline",
    alignSelf: "flex-end",
    fontWeight: "700",
  },
  signupView: {
    flexDirection: "row",
    alignSelf: "center",

    marginTop: 20,
  },
});
