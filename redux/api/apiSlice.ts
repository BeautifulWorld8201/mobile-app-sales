import {
  BaseQueryApi,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../constants";
import { setAccessToken, setRefreshToken, logOut } from "../auth/authSlice";
import moment from "moment";
import { Mutex } from "async-mutex";
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.accessToken?.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: {}
) => {
  console.log("expires:: ", api.getState()?.auth?.accessToken?.expires);
  await mutex.waitForUnlock();
  let result: any = await baseQuery(args, api, extraOptions);

  if (moment().isAfter(api.getState()?.auth?.accessToken?.expires)) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          {
            url: "/auth/refresh-tokens",
            method: "POST",
            body: {
              refreshToken: `${api.getState()?.auth?.refreshToken?.token}`,
            },
          },
          api,
          extraOptions
        );

        if (refreshResult?.data) {
          api.dispatch(setAccessToken(refreshResult?.data?.tokens?.access));
          api.dispatch(setRefreshToken(refreshResult?.data?.tokens?.refresh));
          result = await baseQuery(args, api, extraOptions);
          console.log(
            "new refreshed token",
            refreshResult?.data?.tokens?.access,
            refreshResult?.data?.tokens?.refresh
          );
        } else if (refreshResult?.error) {
          api.dispatch(logOut());
          api.dispatch(apiSlice.util.resetApiState());
          console.log("refresh token error", refreshResult?.error);
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Payouts"],
  endpoints: () => ({}),
});
