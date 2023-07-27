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

let refreshingToken = false;
let tokenRefreshPromise: Promise<void> | null = null;
const tokenRefreshQueue: any = [];
const baseQueryWithReauth = async (args, api, extraOptions) => {
	let result: any = '';

	const refreshTokenIfNeeded = async () => {
		if (refreshingToken) {
			return tokenRefreshPromise;
		} else {
			refreshingToken = true;
			try {
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

				if (refreshResult.data) {
					api.dispatch(setAccessToken(refreshResult?.data?.tokens?.access));
					api.dispatch(setRefreshToken(refreshResult?.data?.tokens?.refresh));
					while (tokenRefreshQueue.length) {
						const { resolve } = tokenRefreshQueue.shift();
						resolve();
					}
				} else if (refreshResult.error) {
					api.dispatch(logOut());
					api.dispatch(apiSlice.util.resetApiState());
					while (tokenRefreshQueue.length) {
						const { reject } = tokenRefreshQueue.shift();
						reject(new Error('Token refresh failed.'));
					}
				}
			} catch (error) {
				console.error('Token refresh error:', error);
				while (tokenRefreshQueue.length) {
					const { reject } = tokenRefreshQueue.shift();
					reject(error);
				}
			} finally {
				refreshingToken = false;
			}
		}
	};

	if (moment().isAfter(api.getState()?.auth?.accessToken?.expires)) {
		if (!tokenRefreshPromise) {
			tokenRefreshPromise = refreshTokenIfNeeded();
		}

		await tokenRefreshPromise;
		tokenRefreshPromise = null;

		result = await baseQuery(args, api, extraOptions);
	} else {
		result = await baseQuery(args, api, extraOptions);
	}

	return result;
};

export const apiSlice = createApi({
	baseQuery: baseQueryWithReauth,
	tagTypes: ['Payouts', 'Notifications'],
	endpoints: (builder) => ({}),
});
