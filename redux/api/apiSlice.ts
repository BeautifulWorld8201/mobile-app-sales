import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { setToken, logOut } from "../auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "www.google.com",

  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.authToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  endpoints: (builder) => ({}),
});
