import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getRefreshedToken } from ".";
import { setAccessToken, setRefreshToken } from "../../redux/auth/authSlice";
import moment from "moment";

const useCheckToken = () => {
  const dispatch = useDispatch();
  const refreshToken = useSelector((state) => state?.auth?.refreshToken?.token);
  const accessToken = useSelector((state) => state?.auth?.accessToken);

  const setTokens = async () => {
    const resp = await getRefreshedToken(refreshToken);
    if (resp?.data) {
      dispatch(setAccessToken(resp?.data?.tokens?.access));
      dispatch(setRefreshToken(resp?.data?.tokens?.refresh));
      return true;
    } else {
      return false;
    }
  };

  const checkTokenExpiry = () => {
    if (moment().isAfter(accessToken?.expires)) {
      return true;
    } else {
      return false;
    }
  };
  return {
    setTokens,
    checkTokenExpiry,
  };
};
export default useCheckToken;
