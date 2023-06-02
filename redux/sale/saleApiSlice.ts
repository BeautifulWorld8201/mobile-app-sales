import { apiSlice } from '../api/apiSlice';
export const saleApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		createSale: builder.mutation({
			query: (data) => ({
				url: '/sales/create',
				method: 'POST',
				body: { ...data },
			}),
		}),
		getSales: builder.query({
			query: () => ({
				url: '/sales',
				method: 'GET',
				// body: { ...data },
			}),
		}),
		getSaleDetail: builder.query({
			query: (id) => ({
				url: `/sales/${id}`,
				method: 'GET',
				// body: { ...data },
			}),
      
		}),
		resendPaymentRequest: builder.mutation({
			query: (id) => ({
				url: `/sales/${id}/resendPaymentRequest`,
				method: 'POST',
				// body: { ...data },
			}),
		}),
		getClientInfo: builder.mutation({
			query: (id) => ({
				url: `/sales/${id}/clientInfo`,
				method: 'GET',
				// body: { ...data },
			}),
		}),
    markAsPaid: builder.mutation({
        query: (id) => ({
          url: `/sales/${id}/markAsPaid`,
          method: "POST",
          // body: { ...data },
        }),
      }),
	}),
	overrideExisting: true,
});

export const {
	useCreateSaleMutation,
	useGetSalesQuery,
	// useGetSalesMutation,
	// useGetSaleDetailMutation,
	useGetSaleDetailQuery,
	useResendPaymentRequestMutation,
	useGetClientInfoMutation,
  useMarkAsPaidMutation
} = saleApiSlice;
