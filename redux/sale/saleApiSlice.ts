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
  }),
  overrideExisting: true,
});

export const { useCreateSaleMutation } = saleApiSlice;
