import { apiSlice } from "../api/apiSlice";

export const userSliceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitApplication: builder.mutation({
      query: (data) => ({
        url: `/users/submitApplication`,
        method: "POST",
        body: data,
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useSubmitApplicationMutation } = userSliceApi;
