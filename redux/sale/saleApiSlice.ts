import { apiSlice } from "../api/apiSlice";
export const saleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createSale: builder.mutation({
      query: (data) => ({
        url: "/sales/create",
        method: "POST",
        body: { ...data },
      }),
    }),
    getSales: builder.mutation({
      query: () => ({
        url: "/sales",
        method: "GET",
        // body: { ...data },
      }),
    }),
    getSaleDetail: builder.mutation({
      query: (id) => ({
        url: `/sales/${id}`,
        method: "GET",
        // body: { ...data },
      }),
    }),
    resendPaymentRequest: builder.mutation({
      query: (id) => ({
        url: `/sales/${id}/resendPaymentRequest`,
        method: "POST",
        // body: { ...data },
      }),
    }),
    getClientInfo: builder.mutation({
      query: (id) => ({
        url: `/sales/${id}/clientInfo`,
        method: "GET",
        // body: { ...data },
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateSaleMutation,
  useGetSalesMutation,
  useGetSaleDetailMutation,
  useResendPaymentRequestMutation,
  useGetClientInfoMutation,
} = saleApiSlice;
