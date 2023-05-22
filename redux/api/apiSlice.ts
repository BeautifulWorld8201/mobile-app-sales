import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../constants";
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

export const apiSlice = createApi({
  baseQuery,
  endpoints: (builder) => ({}),
});
