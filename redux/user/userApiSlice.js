import { apiSlice } from "../api/apiSlice";

export const userSliceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInstructorDetail: builder.mutation({
      query: (data) => ({
        url: `/getInstructorDetail?id=${data}`,
        method: "GET",
        // body: { ...data },
      }),
    }),
    updateInstructorDetail: builder.mutation({
      query: (data) => ({
        url: `/update`,
        method: "PATCH",
        body: { ...data },
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetInstructorDetailMutation,
  useUpdateInstructorDetailMutation,
} = userSliceApi;
