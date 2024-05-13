import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@src/app/baseApi'
import { sessionSlice } from '@src/app/features/session/sessionSlice'

export const rootReducer = combineReducers({
	[baseApi.reducerPath]: baseApi.reducer,
	[sessionSlice.name]: sessionSlice.reducer,
})

export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}).concat([baseApi.middleware]),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
