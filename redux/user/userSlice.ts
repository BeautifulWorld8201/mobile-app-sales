import { createSlice } from '@reduxjs/toolkit';
const userSlice = createSlice({
	name: 'user',
	initialState: {
		user: {},
		applicationStatus: '',
		expoPushToken: '',
	},
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload;
		},
		setApplicationStatus: (state, action) => {
			state.applicationStatus = action.payload;
		},
		setExpoPushToken: (state, action) => {
			state.expoPushToken = action.payload;
		},
	},
});
export const { setUser, setApplicationStatus, setExpoPushToken } = userSlice.actions;

export default userSlice.reducer;
