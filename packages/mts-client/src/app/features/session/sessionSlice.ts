import { createSlice } from '@reduxjs/toolkit'
import { authApi } from '@src/app/services/auth/api'
import { AtPayloadDto } from '@src/app/services/auth/types'
import { RootState } from '@src/app/store'

type SessionSliceState = {
	user: AtPayloadDto | null
}

const initialState: SessionSliceState = {
	user: null,
}

export const sessionSlice = createSlice({
	name: 'session',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addMatcher(
			authApi.endpoints.me.matchFulfilled,
			(state: SessionSliceState, { payload }) => {
				state.user = payload
			},
		)
	},
})

export const selectUser = (state: RootState) => state.session.user
