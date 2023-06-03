import { apiSlice } from "../api/apiSlice";

export const userSliceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.mutation({
      query: () => ({
        url: `/users/me`,
        method: "GET",
      }),
    }),

    submitApplication: builder.mutation({
      query: (data) => ({
        url: `/users/submitApplication`,
        method: "POST",
        body: data,
      }),
    }),
    payoutMethod: builder.mutation({
      query: (data) => ({
        url: `/users/payoutMethod`,
        method: "POST",
        body: data,
      }),
    }),
    deletePayoutMethod: builder.mutation({
      query: (id) => ({
        url: `/users/payoutMethod/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payouts"],
    }),
    getPayoutMethod: builder.query({
      query: () => ({
        url: `/users/payoutMethod`,
        method: "GET",
      }),
      providesTags: ["Payouts"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useSubmitApplicationMutation,
  useGetUserMutation,
  usePayoutMethodMutation,
  useGetPayoutMethodQuery,
  useDeletePayoutMethodMutation,
} = userSliceApi;
