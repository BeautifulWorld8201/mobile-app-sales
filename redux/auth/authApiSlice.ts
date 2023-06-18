import { apiSlice } from "../api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: { ...data },
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { ...data },
      }),
    }),
    signUp: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: { ...data },
      }),
    }),
    refreshToken: builder.mutation({
      query: (data) => ({
        url: "/auth/refresh-tokens",
        method: "POST",
        body: { ...data },
      }),
    }),
    logoutUser: builder.mutation({
      query: (data) => ({
        url: "/auth/logout",
        method: "POST",
        body: { ...data },
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useSignUpMutation,
  useRefreshTokenMutation,
  useLogoutUserMutation,
} = authApiSlice;
