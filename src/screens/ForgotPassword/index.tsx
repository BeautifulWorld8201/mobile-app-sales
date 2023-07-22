import React, { useEffect, useRef } from "react";
import { Image, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import Text from "../../../components/Text";
import { View } from "../../../components/Themed";
import { tintColorDark } from "../../../constants/Colors";
import { useForgotPasswordMutation } from "../../../redux/auth/authApiSlice";
import { hp, wp } from "../../../utils";
import { useTranslation } from "react-i18next";
import Toast from "react-native-root-toast";

export default function ForgotPassword(props: any) {
  const { t } = useTranslation();

  const [forgot, forResponse] = useForgotPasswordMutation();
  const dispatch = useDispatch();
  const _formik = useRef();

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .required("Required")
      .email("Please enter a valid email address")
      .matches(/@[^.]*\./, "Please enter a valid email address"),
  });

  const onForgot = async (values: object) => {
    try {
      const resp = await forgot(values);

      console.log("resp", resp);
      if (resp?.error) {
        Toast.show(resp?.error?.data?.message, {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
      } else {
        Toast.show(t("Password recovery link has been sent to your email"), {
          duration: Toast.durations.SHORT,
          position: Toast.positions.CENTER,
        });
        props.navigation.navigate("Signin");
      }
    } catch (err) {
      console.log("forgot password error", err);
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
          <Text style={styles.forgotFont}>{t("Forgot password")}</Text>
          <Text style={styles.detailFont}>
            {t(
              "Provide your account email for which you want to reset your password",
            )}
          </Text>

          <View>
            <Formik
              innerRef={_formik}
              initialValues={{
                email: "",
              }}
              validationSchema={validationSchema}
              validateOnBlur={false}
              onSubmit={(values) => onForgot(values)}
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
                  <Text style={styles.credsFont}>{t("Email")}</Text>
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
                </View>
              )}
            </Formik>
            <View style={styles.buttonContainer}>
              <Button
                style={styles.button}
                onPress={() => {
                  _formik.current.handleSubmit();
                }}
                isLoading={forResponse.isLoading}
                disabled={forResponse.isLoading}
                loaderColor={styles.loaderColor}
              >
                <Text style={styles.buttonText}>{t("Recover Password")}</Text>
              </Button>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "white",
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
  forgotFont: {
    fontWeight: "700",
    fontSize: hp(3),
    color: "black",
    marginBottom: hp(2),
    textTransform: "capitalize",
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
});
