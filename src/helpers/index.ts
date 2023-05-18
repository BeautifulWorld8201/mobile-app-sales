import { baseUrl } from "../../constants";
import axios from "axios";
export const getRefreshedToken = (token: string) => {
  const body = {
    refreshToken: token,
  };
  return axios({
    url: `${baseUrl}/auth/refresh-tokens`,
    method: "POST",
    data: body,
  });
};
