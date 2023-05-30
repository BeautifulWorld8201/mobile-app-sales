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
  }),

  overrideExisting: true,
});

export const { useCreateSaleMutation, useGetSalesMutation } = saleApiSlice;
