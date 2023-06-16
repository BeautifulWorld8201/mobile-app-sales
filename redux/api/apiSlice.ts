import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../../constants';
import { setAccessToken, setRefreshToken, logOut } from '../auth/authSlice';
import moment from 'moment';

const baseQuery = fetchBaseQuery({
	baseUrl: baseUrl,
	prepareHeaders: (headers, { getState }) => {
		const token = getState()?.auth?.accessToken?.token;

		if (token) {
			headers.set('Authorization', `Bearer ${token}`);
		}
		return headers;
	},
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
	let result: any = '';

	if (moment().isAfter(api.getState()?.auth?.accessToken?.expires)) {
		const refreshResult = await baseQuery(
			{
				url: '/auth/refresh-tokens',
				method: 'POST',
				body: {
					refreshToken: `${api.getState()?.auth?.refreshToken?.token}`,
				},
			},
			api,
			extraOptions
		);

		if (refreshResult?.data) {
			api.dispatch(setAccessToken(refreshResult?.data?.tokens?.access));
			api.dispatch(setRefreshToken(refreshResult?.data?.tokens?.refresh));
			result = await baseQuery(args, api, extraOptions);
		} else if (refreshResult?.error) {
			api.dispatch(logOut());
			api.dispatch(apiSlice.util.resetApiState());
		}
	} else {
		result = await baseQuery(args, api, extraOptions);
	}
	return result;
};

export const apiSlice = createApi({
	baseQuery: baseQueryWithReauth,
	tagTypes: ['Payouts'],
	endpoints: (builder) => ({}),
});
